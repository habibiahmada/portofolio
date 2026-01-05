import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { remark } from 'remark';
import html from 'remark-html';

import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/ratelimit';

const resend = new Resend(process.env.RESEND_API_KEY);

type AttachmentPayload = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

type ContactPayload = {
  recaptchaToken: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string | null;
  attachment?: AttachmentPayload | null;
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    /* ================= RATE LIMIT ================= */
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const limit = rateLimit(ip);

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 },
      );
    }

    /* ================= BODY ================= */
    const {
      recaptchaToken,
      name,
      email,
      subject,
      message,
      phone,
      attachment,
    }: ContactPayload = await req.json();

    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'Missing reCAPTCHA' },
        { status: 400 },
      );
    }

    /* ================= RECAPTCHA ================= */
    const verifyResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      },
    );

    const captcha: { success: boolean } = await verifyResponse.json();

    if (!captcha.success) {
      return NextResponse.json(
        { error: 'Invalid reCAPTCHA' },
        { status: 403 },
      );
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 },
      );
    }

    /* ================= PREPARE DB ================= */
    const row: Record<string, unknown> = {
      name,
      email,
      phone: phone ?? null,
      subject,
      message,
      created_at: new Date().toISOString(),
    };

    let attachmentBuffer: Buffer | null = null;
    let attachmentFilename: string | null = null;
    let attachmentMime: string | null = null;

    if (attachment?.dataUrl) {
      const match = attachment.dataUrl.match(/^data:(.+);base64,(.*)$/);

      if (match) {
        attachmentMime = match[1];
        attachmentBuffer = Buffer.from(match[2], 'base64');
        attachmentFilename =
          attachment.name || `attachment-${Date.now()}`;

        const bucket =
          process.env.SUPABASE_CONTACT_BUCKET ?? 'contact-attachments';

        try {
          const path = `${Date.now()}-${attachmentFilename}`;
          await supabaseAdmin.storage.from(bucket).upload(
            path,
            attachmentBuffer,
            {
              contentType: attachmentMime,
            },
          );

          const { data } = supabaseAdmin
            .storage
            .from(bucket)
            .getPublicUrl(path);

          row.attachment_url = data?.publicUrl ?? null;
          row.attachment_name = attachmentFilename;
        } catch {
          row.attachment_name = attachmentFilename;
          row.attachment_mime = attachmentMime;
        }
      }
    }

    /* ================= SAVE DB ================= */
    const db = supabaseAdmin ?? supabase;
    const insertResult = await db.from('contacts').insert(row);

    if (insertResult.error) {
      return NextResponse.json(
        { error: 'Failed to save contact' },
        { status: 500 },
      );
    }

    /* ================= EMAIL BODY ================= */
    const bodyText = `
New Contact Message

Name: ${name}
Email: ${email}
Phone: ${phone ?? '-'}
Subject: ${subject}

Message:
${message}
`.trim();

    let bodyHtml = bodyText.replace(/\n/g, '<br />');

    try {
      const processed = await remark().use(html).process(bodyText);
      bodyHtml = String(processed);
    } catch {
      // fallback ke plain HTML
    }

    /* ================= SEND EMAIL ================= */
    await resend.emails.send({
      from: 'Habibi Ahmad <contact@habibiahmada.dev>',
      to: ['contact@habibiahmada.dev'],
      replyTo: email,
      subject: `New Contact: ${subject}`,
      html: bodyHtml,
      attachments:
        attachmentBuffer && attachmentFilename
          ? [
              {
                filename: attachmentFilename,
                content: attachmentBuffer,
              },
            ]
          : undefined,
    });

    return NextResponse.json({ ok: true, saved: true });
  } catch (error) {
    console.error('Contact error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}