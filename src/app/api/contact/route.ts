import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';
import { remark } from 'remark';
import html from 'remark-html';
import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/ratelimit';

type AttachmentPayload = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

type ContactPayload = {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  attachment?: AttachmentPayload | null;
};

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      "unknown";
    const limit = rateLimit(ip);
    if (!limit.success) {
      return NextResponse.json(
        { message: "Too many requests. Please wait." },
        { status: 429 }
      );
    }
    const body = (await req.json()) as Partial<ContactPayload> | undefined;
    const { name, email, phone, subject, message, attachment } = (body ?? {}) as ContactPayload;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare DB row
    const row: Record<string, unknown> = {
      name,
      email,
      phone: phone ?? null,
      subject,
      message,
      created_at: new Date().toISOString(),
    };

    // Handle attachment: parse dataUrl
    let attachmentBuffer: Buffer | null = null;
    let attachmentFilename: string | null = null;
    let attachmentMime: string | null = null;
    if (attachment && attachment.dataUrl) {
      const match = String(attachment.dataUrl).match(/^data:(.+);base64,(.*)$/);
      if (match) {
        attachmentMime = match[1];
        const base64 = match[2];
        attachmentBuffer = Buffer.from(base64, 'base64');
        attachmentFilename = attachment.name || `attachment-${Date.now()}`;

        // If supabaseAdmin available and bucket configured, try to upload
        const bucket = process.env.SUPABASE_CONTACT_BUCKET || 'contact-attachments';
        if (supabaseAdmin) {
          try {
            const path = `${Date.now()}-${attachmentFilename}`;
            await supabaseAdmin.storage.from(bucket).upload(path, attachmentBuffer, {
              contentType: attachmentMime || undefined,
            });
            const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
            row.attachment_url = data?.publicUrl ?? null;
            row.attachment_name = attachmentFilename;
          } catch (e: unknown) {
            // Fallback to storing metadata only
            row.attachment_name = attachmentFilename;
            row.attachment_mime = attachmentMime;
            console.warn('Supabase storage upload failed', e instanceof Error ? e.message : String(e));
          }
        } else {
          // No admin key — store minimal metadata and (optionally) base64 in DB
          row.attachment_name = attachmentFilename;
          row.attachment_mime = attachmentMime;
          // WARNING: storing base64 in DB may be large; only do if bucket not available
          row.attachment_base64 = match[2];
        }
      }
    }

    // Insert into Supabase table `contacts`. Make sure the table exists with compatible columns.
    const db = supabaseAdmin ?? supabase;
    const insertRes = await db.from('contacts').insert(row).select();
    if (insertRes.error) {
      console.error('Supabase insert error', insertRes.error);
      // continue — still attempt to send email, but return 500 to client
      return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 });
    }

    // Send email with nodemailer
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const toEmail = process.env.AUTHORIZED_EMAIL;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('SMTP config missing; skipping email send');
      return NextResponse.json({ ok: true, saved: true });
    }

    console.log("SMTP_HOST:", smtpHost);
    console.log("SMTP_PORT:", smtpPort);
    console.log("SMTP_USER:", smtpUser);
    console.log("SMTP_PASS exists:", !!smtpPass);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Try to fetch an email template from Supabase (key = 'contact')
    let template: { subject?: string; body?: string } | null = null;
    try {
      const dbForTemplates = supabaseAdmin ?? supabase;
      const tplRes = await dbForTemplates.from('email_templates').select('*').eq('key', 'contact').limit(1).maybeSingle();
      if (!tplRes.error && tplRes.data) template = tplRes.data as { subject?: string; body?: string };
    } catch (e: unknown) {
      console.warn('Failed to fetch email template', e instanceof Error ? e.message : String(e));
    }

    const placeholders: Record<string, string> = {
      name: String(name ?? ''),
      email: String(email ?? ''),
      message: String(message ?? ''),
      phone: String(phone ?? ''),
      subject: String(subject ?? ''),
    };

    const replacePlaceholders = (input: string) => {
      return String(input).replace(/{{\s*(\w+)\s*}}/g, (_, key) => placeholders[key] ?? '');
    };

    const finalSubject = template?.subject ? replacePlaceholders(template.subject) : `New contact: ${subject} — ${name}`;
    let finalBodyText = template?.body ? replacePlaceholders(template.body) : `You have a new contact message:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nSubject: ${subject}\nMessage:\n${message}`;


    finalBodyText = String(finalBodyText).replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');

    let finalBodyHtml = finalBodyText.replace(/\n/g, '<br/>');
    try {
      const processed = await remark().use(html).process(finalBodyText);
      finalBodyHtml = String(processed);
    } catch (e: unknown) {
      console.warn('Failed to convert markdown to HTML for email body', e instanceof Error ? e.message : String(e));
    }

    const mailOptions: SendMailOptions = {
      from: process.env.CONTACT_FROM_EMAIL || smtpUser,
      to: toEmail,
      subject: finalSubject,
      text: finalBodyText,
      html: finalBodyHtml,
    };

    if (attachmentBuffer && attachmentFilename) {
      mailOptions.attachments = [
        {
          filename: attachmentFilename,
          content: attachmentBuffer,
          contentType: attachmentMime || undefined,
        },
      ];
    }

    try {
      await transporter.sendMail(mailOptions);
    } catch (e: unknown) {
      console.error('Failed to send email', e instanceof Error ? e.message : String(e));
      return NextResponse.json({ ok: false, saved: true, email: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }

    return NextResponse.json({ ok: true, saved: true });
  } catch (e: unknown) {
    console.error('Contact handler error', e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
