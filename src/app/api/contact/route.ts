import nodemailer from 'nodemailer';
import { remark } from 'remark';
import html from 'remark-html';
import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

type AttachmentPayload = {
  name: string;
  type: string;
  size: number;
  dataUrl: string; // data:<mime>;base64,...
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, attachment } = body as any;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare DB row
    const row: any = {
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
          } catch (err) {
            // Fallback to storing metadata only
            row.attachment_name = attachmentFilename;
            row.attachment_mime = attachmentMime;
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
    const toEmail = process.env.CONTACT_TO_EMAIL || 'habibiahmadaziz@gmail.com';

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('SMTP config missing; skipping email send');
      return NextResponse.json({ ok: true, saved: true });
    }

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
    let template: any = null;
    try {
      const dbForTemplates = supabaseAdmin ?? supabase;
      const tplRes = await dbForTemplates.from('email_templates').select('*').eq('key', 'contact').limit(1).maybeSingle();
      if (!tplRes.error && tplRes.data) template = tplRes.data;
    } catch (err) {
      console.warn('Failed to fetch email template', err);
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
    } catch (err) {
      console.warn('Failed to convert markdown to HTML for email body', err);
    }

    const mailOptions: any = {
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
    } catch (err) {
      console.error('Failed to send email', err);
      return NextResponse.json({ ok: false, saved: true, email: false, error: String(err) }, { status: 500 });
    }

    return NextResponse.json({ ok: true, saved: true });
  } catch (err) {
    console.error('Contact handler error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
