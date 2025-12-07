Contact API setup

Required environment variables (add to `.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key
- `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` — (optional but recommended) service role key to allow storage uploads
- `SUPABASE_CONTACT_BUCKET` — (optional) storage bucket name for attachments, defaults to `contact-attachments`

SMTP (for email sending):

- `SMTP_HOST` — SMTP server host (e.g., `smtp.gmail.com`)
- `SMTP_PORT` — SMTP port (587 or 465)
- `SMTP_USER` — SMTP username (for Gmail use your email)
- `SMTP_PASS` — SMTP password or app password
- `CONTACT_FROM_EMAIL` — optional from address (defaults to `SMTP_USER`)
- `CONTACT_TO_EMAIL` — recipient address (defaults to `habibiahmadaziz@gmail.com`)

Notes:
- This handler accepts JSON POST with fields: `name`, `email`, `phone`, `subject`, `message`, and optional `attachment` object (`{ name, type, size, dataUrl }`).
- The client in this repo converts selected file to a base64 `dataUrl` and sends it in the body.
- If you want attachments uploaded to Supabase Storage, set `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` and ensure the bucket exists.
- For Gmail, create an app password (if using 2FA) and use it as `SMTP_PASS`.
