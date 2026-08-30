# Security Guidelines

Security features for authentication and the admin panel.

## Security features implemented

### 1. Authentication methods

- **OAuth (Google & GitHub):** Secure OAuth 2.0 flow via Supabase
- **Email/password:** Local authentication with Supabase hashing
- **Email whitelist:** Only emails listed in `ADMIN_ALLOWED_EMAILS` can sign in

### 2. Rate limiting

- **Login:** 5 attempts per 15 minutes per IP
- **Signup:** 3 attempts per 1 hour per IP
- Helps prevent brute-force attacks

### 3. Password security

Passwords must meet strong criteria:

- At least 8 characters
- At least 1 uppercase letter (A–Z)
- At least 1 lowercase letter (a–z)
- At least 1 digit (0–9)
- At least 1 special character (!@#$%^&*)

Valid example: `MyPassword123!`

### 4. Input validation

- Email format validation (RFC 5322)
- Input sanitization (max 500 chars, strips potential HTML tags)
- Password length limit (max 512 chars)
- JSON parsing with error handling

### 5. Session management

- Secure HTTP-only cookies via Supabase SSR
- Automatic session refresh
- Session expiration handling
- Cache-control headers on sensitive pages

### 6. Security headers (global)

```
X-Content-Type-Options: nosniff      # Prevent MIME sniffing
X-Frame-Options: DENY                # Prevent clickjacking
X-XSS-Protection: 1; mode=block      # XSS protection
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Cache-Control: no-store (for /admin & /login)
```

### 7. Error handling

- Generic error messages (no user-enumeration leaks)
- Failed login attempts do not reveal specific reasons
- Detailed logging on the server for monitoring
- No sensitive data in error responses

### 8. IP tracking and logging

All auth events are logged with:

- User email (when available)
- Client IP address
- Timestamp
- Event type (login, signup, logout, failed attempt)

Log format: `[AUTH] Event - Details (IP: xxx.xxx.xxx.xxx)`

### 9. Authorization checks

- `/admin` routes protected by middleware
- Email whitelist validation at multiple layers:
  - OAuth callback
  - Email/password login
  - Middleware proxy
- Immediate sign-out for unauthorized users

### 10. Database security

- Service role key for admin operations (server only)
- Anonymous key for public APIs
- Row-level security (RLS) enabled in Supabase

### 11. Agent blog API (`POST /api/agent/blog`)

Dedicated machine-to-machine endpoint so agent-hub can publish one blog post per day.

- **Auth:** `Authorization: Bearer $AGENT_BLOG_TOKEN` — compared with `crypto.timingSafeEqual` after SHA-256 hashing (no length leak). The token is not the Supabase service role key; its blast radius is limited to creating one published post per day.
- **Token management:** generate with `openssl rand -base64 32`; store in Vercel env + agent-hub secrets only; never commit; rotate by replacing the env value. Never log the `Authorization` header.
- **Daily quota:** max 1 successful agent create per calendar day in `Asia/Jakarta` → second create gets `429 QUOTA_EXCEEDED`.
- **IP rate limit:** max 5 requests/hour per IP on top of the quota (reuses the shared rate limiter).
- **Payload limits:** raw body ≤ 128 KB; `body_md` ≤ 100,000 chars; title/description/category/tags validated against docs/blog.md §7.
- **Content rules:** em dashes (`—`) rejected with `400`; slug conflicts return `409`; only English posts accepted.
- **Writes** go through the service role client only after token validation; RLS still blocks all public writes on `blog_posts`.
- **Audit:** creates are logged as `[BLOG_AGENT] created slug=...` without any secret material.

---

## Admin management

### Create admin user

```bash
bun scripts/create-admin.ts <email> <password>
```

Example:

```bash
bun scripts/create-admin.ts admin@example.com "MyPassword123!"
```

### Allowed emails configuration

Edit `.env.local`:

```env
ADMIN_ALLOWED_EMAILS=admin@example.com,other-admin@example.com
```

For multiple emails, use commas with no spaces.

---

## Best practices

### For users

1. Use a strong, unique password
2. Do not share credentials
3. Sign out when finished
4. Watch for phishing attempts
5. Clear browser cookies on shared computers

### For developers

1. Never commit `.env.local` to the repository
2. Rotate secrets regularly
3. Monitor auth logs for suspicious activity
4. Keep dependencies updated
5. Use HTTPS in production (non-negotiable)
6. Review rate-limit thresholds for your use case

### For production

1. Use Redis for rate limiting (not in-memory)
2. Enable 2FA when supported
3. Set up monitoring and alerting for failed logins
4. Use production-grade secrets management (AWS Secrets Manager, etc.)
5. Run regular security audits
6. Implement request signing for API calls where appropriate
7. Set up a WAF (Web Application Firewall)

---

## API endpoints

### Authentication

- `POST /api/auth/login` — OAuth login (Google/GitHub)
- `POST /api/auth/email-password` — Email/password login
- `POST /api/auth/signup` — Create new admin user
- `POST /api/auth/logout` — Sign out
- `GET /api/auth/me` — Get current user
- `GET /api/auth/callback` — OAuth callback handler
- `GET /api/auth/debug` — **Dev only.** Returns 404 in production. In development requires an authenticated allowlisted admin; never returns the raw allowlist string.

### Rate limiting response

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Too many login attempts. Please try again later.",
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```

HTTP status: `429 Too Many Requests`

### Failed authorization response

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Invalid email or password.",
    "code": "INVALID_CREDENTIALS"
  }
}
```

HTTP status: `401 Unauthorized` or `403 Forbidden`

---

## Security incidents

If a security incident occurs:

1. Change all passwords immediately
2. Check `.env.local` for secret leakage
3. Review auth logs for unauthorized access
4. Rotate Supabase service keys if needed
5. Check Supabase project settings for suspicious logins
6. Update whitelist emails if needed

---

## Security contact

For security concerns or vulnerabilities:

- Email: [contact@habibiahmada.dev](mailto:contact@habibiahmada.dev)
- Do not report vulnerabilities in public GitHub issues

---

**Last updated:** 2026-07-23  
**Security level:** Medium (hobby/solo project)
