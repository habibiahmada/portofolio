# Security Guidelines

Dokumentasi fitur keamanan untuk authentication dan admin panel.

## 🔒 Security Features Implemented

### 1. Authentication Methods
- **OAuth (Google & GitHub)**: Secure OAuth 2.0 flow via Supabase
- **Email/Password**: Local authentication dengan hashing Supabase
- **Email Whitelist**: Hanya email yang di-list di `ADMIN_ALLOWED_EMAILS` yang bisa login

### 2. Rate Limiting
- **Login**: 5 attempts per 15 minutes per IP
- **Signup**: 3 attempts per 1 hour per IP
- Mencegah brute force attacks

### 3. Password Security
Password harus memenuhi kriteria kuat:
- Minimal 8 karakter
- Minimal 1 huruf besar (A-Z)
- Minimal 1 huruf kecil (a-z)
- Minimal 1 angka (0-9)
- Minimal 1 karakter khusus (!@#$%^&*)

Contoh password yang valid: `MyPassword123!`

### 4. Input Validation
- Email format validation sesuai RFC 5322
- Sanitasi input (max 500 chars, remove potential HTML tags)
- Password length limit (max 512 chars)
- JSON parsing dengan error handling

### 5. Session Management
- Secure HTTP-only cookies via Supabase SSR
- Automatic session refresh
- Session expiration handling
- Cache control headers untuk sensitive pages

### 6. Security Headers (Global)
```
X-Content-Type-Options: nosniff      # Prevent MIME sniffing
X-Frame-Options: DENY                # Prevent clickjacking
X-XSS-Protection: 1; mode=block      # XSS protection
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Cache-Control: no-store (untuk /admin & /login)
```

### 7. Error Handling
- Generic error messages (tidak bocor info bahwa user ada atau tidak)
- Failed login attempts tidak menunjukkan alasan spesifik
- Detailed logging di server-side untuk monitoring
- No sensitive data dalam error responses

### 8. IP Tracking & Logging
Semua auth events di-log dengan:
- User email (jika tersedia)
- Client IP address
- Timestamp
- Event type (login, signup, logout, failed attempt)

Log format: `[AUTH] Event - Details (IP: xxx.xxx.xxx.xxx)`

### 9. Authorization Checks
- `/admin` routes protected by middleware
- Email whitelist validation di multiple layers:
  - OAuth callback
  - Email/password login
  - Middleware proxy
- Immediate signout untuk unauthorized users

### 10. Database Security
- Service role key untuk admin operations (hanya di server)
- Anonymous key untuk public APIs
- Row-level security (RLS) di Supabase

---

## 🛠️ Admin Management

### Create Admin User
```bash
bun scripts/create-admin.ts <email> <password>
```

Contoh:
```bash
bun scripts/create-admin.ts habibiahmadaziz@gmail.com "MyPassword123!"
```

### Allowed Emails Configuration
Edit `.env.local`:
```env
ADMIN_ALLOWED_EMAILS=habibiahmadaziz@gmail.com,other-admin@example.com
```

Untuk multiple emails, gunakan comma tanpa spaces.

---

## 🔐 Best Practices

### For Users
1. ✅ Gunakan password yang kuat dan unique
2. ✅ Jangan share credentials Anda
3. ✅ Logout setelah selesai
4. ✅ Hati-hati dengan phishing attempts
5. ✅ Clear browser cookies jika di shared computer

### For Developers
1. ✅ Never commit `.env.local` ke repository
2. ✅ Rotate secrets regularly
3. ✅ Monitor auth logs untuk suspicious activities
4. ✅ Keep dependencies updated
5. ✅ Use HTTPS in production (non-negotiable)
6. ✅ Review rate limit thresholds untuk use case Anda

### For Production
1. ✅ Use Redis untuk rate limiting (bukan in-memory)
2. ✅ Enable 2FA jika supported
3. ✅ Setup monitoring & alerting untuk failed logins
4. ✅ Use production-grade secrets management (AWS Secrets Manager, etc)
5. ✅ Regular security audits
6. ✅ Implement request signing untuk API calls
7. ✅ Setup WAF (Web Application Firewall)

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - OAuth login (Google/GitHub)
- `POST /api/auth/email-password` - Email/password login
- `POST /api/auth/signup` - Create new admin user
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user
- `GET /api/auth/callback` - OAuth callback handler
- `GET /api/auth/debug` - **Dev-only.** Returns 404 in production. In development requires an authenticated allowlisted admin; never returns the raw allowlist string.

### Rate Limiting Response
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
HTTP Status: `429 Too Many Requests`

### Failed Authorization Response
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
HTTP Status: `401 Unauthorized` atau `403 Forbidden`

---

## 🚨 Security Incidents

Jika terjadi security incident:
1. Immediately change all passwords
2. Check `.env.local` untuk secrets leakage
3. Review auth logs untuk unauthorized access
4. Rotate Supabase service keys jika diperlukan
5. Check Supabase project settings untuk suspicious logins
6. Update whitelist emails jika needed

---

## 📞 Security Contact

Untuk security concerns atau vulnerabilities:
- Email: contact@habibiahmada.dev
- Jangan public report di GitHub issues

---

**Last Updated**: 2026-07-23  
**Security Level**: Medium (for hobby project)
