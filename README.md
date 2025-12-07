# 🌐 Personal Portfolio Website
<img width="1912" height="942" alt="screencapture-localhost-3000-en-2025-09-06-21_12_54" src="https://github.com/user-attachments/assets/0f1a7549-937e-4d32-a1f1-e860e4d26907" />

Portfolio website profesional yang menampilkan profil, pengalaman, proyek, layanan, sertifikasi, testimoni, artikel, hingga kontak dengan keamanan tingkat lanjut. Dibangun dengan fokus pada **User Experience (UX)**, **Konversi Pengunjung**, **SEO**, **Keamanan**, dan **Responsivitas**.

---

## ✨ Fitur Utama

### 🔝 Konten & Struktur
- **Hero / Banner Section**  
  Nama, headline singkat, CTA (Contact / Download Resume), ilustrasi/animasi.
- **Stats Section & Client Logos**  
  Angka capaian (10+ projects, 5+ tahun pengalaman) & logo klien.
- **About Me**  
  Ringkasan personal & profesional, foto, highlight keahlian.
- **Services**  
  Layanan yang ditawarkan dengan deskripsi singkat & CTA.
- **Projects**  
  Kartu proyek dengan filter (kategori, teknologi, tahun) + search bar.
- **Skills**  
  Grouping: Core, Frameworks, Tools, Others (ikon & level).
- **Experiences**  
  Timeline: edukasi, pekerjaan, organisasi, non-formal education.
- **Certifications & Awards**  
  Sertifikat kursus/lomba & penghargaan.
- **Testimonials**  
  Carousel kartu testimoni dengan nama, jabatan, pesan.
- **Related Articles / Media**  
  Link artikel atau liputan terkait diri.
- **FAQ (Carousel)**  
  Pertanyaan umum + jawaban ringkas.
- **Contact Me**  
  Form kontak dengan reCAPTCHA, notifikasi sukses, server-side email protection.
- **Footer**  
  Navigasi cepat, language switcher, dark mode toggle, social links.

### 🛠️ Fungsionalitas
- Filter proyek berdasarkan kategori/teknologi/tahun.
- Search bar global untuk proyek.
- Sticky navigation dengan shrink-on-scroll.
- SEO & meta tag (Open Graph, Twitter Card, JSON-LD schema).
- Resume bisa **view online** & **download multi-format (PDF, DOCX, TXT)**.
- Popup/notification untuk aksi penting.
- Multi-language (ID/EN) dengan i18n.
- Dark mode toggle (default sesuai OS).

### 🔐 Keamanan
- HTTPS (SSL/TLS).
- reCAPTCHA di form kontak.
- Lazy loading untuk gambar/video.
- Kompresi file resume & gambar.
- Rate limiting: max 3 submission/IP/jam.
- Meta tag keamanan (`CSP`, `HSTS`, `X-Frame-Options`, dll).
- Server-side email protection (tidak menampilkan email mentah).
- Backup berkala (DB & file storage).

---

## 🏗️ Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) – React framework untuk SSR & SSG.
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first styling.
- [Radix UI](https://www.radix-ui.com/) – Accessible components.
- [next-i18next](https://github.com/i18next/next-i18next) – Multilanguage.
- [Lucide Icons](https://lucide.dev/) – Ikon modern.

### Backend
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) atau [Laravel](https://laravel.com/) – API untuk form & resume.
- [PostgreSQL](https://www.postgresql.org/) / [Firestore] – Penyimpanan data dinamis.
- [EmailJS / SendGrid / SES] – Pengiriman email aman.

### Infrastruktur
- Hosting frontend: **Vercel / Netlify**.
- Hosting backend: **DigitalOcean / AWS / Railway**.
- CDN: **Cloudflare / Vercel Edge**.
- File storage: **AWS S3**.
- Backup: otomatis ke storage eksternal (S3 Glacier).

---

## 📂 Struktur Direktori (contoh Next.js)

```bash
.
├── public/             # Static assets (images, icons, resume, etc.)
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Next.js pages (index, projects, contact, etc.)
│   ├── layouts/        # Layout wrappers
│   ├── styles/         # Global CSS (if needed)
│   ├── lib/            # Utilities (SEO config, analytics, etc.)
│   ├── data/           # JSON data: projects, skills, testimonials
│   └── i18n/           # Multilanguage files (id.json, en.json)
├── backend/            # Express/Laravel backend for contact & resume
├── tests/              # Unit & E2E tests
├── .env.example        # Environment variables example
└── README.md
````

---

## ⚙️ Instalasi & Setup

### 1. Clone Repo

```bash
git clone https://github.com/username/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Buat file `.env.local` (frontend) & `.env` (backend):

```env
# Frontend
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY=...

# Backend
DATABASE_URL=postgres://...
EMAIL_PROVIDER_API_KEY=...
RECAPTCHA_SECRET_KEY=...
```

### 4. Jalankan Development Server

```bash
npm run dev
# buka http://localhost:3000
```

### 5. Build & Production

```bash
npm run build
npm run start
```

---

## 🔑 API Endpoints

### `POST /api/contact`

Mengirim pesan dari form kontak.
Payload:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Hello, I'm interested...",
  "recaptchaToken": "xxxx"
}
```

Respon:

```json
{"success": true, "message": "Pesan berhasil dikirim"}
```

### `GET /api/projects`

List proyek dengan filter & search:

```http
GET /api/projects?tech=react&year=2024&search=dashboard
```

### `GET /api/projects/:slug`

Detail proyek.

### `GET /api/resume?format=pdf|docx|txt`

Download resume.

---

## 🧪 Testing

* **Unit tests**: komponen utama (Hero, ProjectCard, ContactForm).
* **E2E tests**: alur user (lihat proyek → filter → kontak).
* **Accessibility tests**: axe-core / Lighthouse A11Y.
* **Load test**: endpoint `/api/contact` untuk memastikan rate limiting.

Menjalankan tes:

```bash
npm run test
npm run test:e2e
```

---

## 📊 SEO & Analytics

* `sitemap.xml` & `robots.txt` otomatis.
* JSON-LD schema untuk Person, Website, Project.
* OpenGraph (Facebook, LinkedIn) & Twitter Card.
* Integrasi analytics (GA4 / Plausible).

---

## 🔒 Keamanan

* HTTPS by default (HSTS).
* reCAPTCHA + server-side verification.
* Rate limiting 3/jam/IP.
* File upload dibatasi: max 5MB, hanya PDF/DOCX/JPG/PNG.
* Security headers: CSP, X-Frame-Options, X-Content-Type-Options.
* Email tidak ditampilkan mentah.

---

## 📦 Deployment

* **Frontend**: Deploy ke [Vercel](https://vercel.com/) (SSR & edge ready).
* **Backend**: Deploy ke [Railway](https://railway.app/) / \[DigitalOcean] / \[AWS].
* **Database**: PostgreSQL (Supabase / Neon / RDS).
* **File Storage**: AWS S3.
* Setup CI/CD pipeline (GitHub Actions).

---

## 🔄 Backup & Recovery

* Backup database otomatis harian → disimpan di S3 Glacier (retensi 30 hari).
* Backup resume & assets → incremental sync.
* Disaster recovery plan: restore < 30 menit.

---

## 📌 Roadmap

* [ ] Admin dashboard untuk CRUD konten (projects, testimonials, FAQ).
* [ ] Blog section dengan MDX.
* [ ] Dark mode theme customization.
* [ ] Integrasi PWA (offline support).
* [ ] Mode portfolio “lite” (untuk loading lebih cepat di mobile low-end).

---

## 🧑‍💻 Kontribusi

1. Fork repo ini.
2. Buat branch fitur (`git checkout -b feature/fitur-baru`).
3. Commit perubahan (`git commit -m "Tambah fitur X"`).
4. Push branch (`git push origin feature/fitur-baru`).
5. Ajukan Pull Request.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** – bebas digunakan, dimodifikasi, dan didistribusikan dengan atribusi.

---

## 👤 Kontak

* Website: [habibiahmada.dev](https://habibiahmada.dev)
* LinkedIn: [linkedin.com/in/habibi-ahmad-aziz](https://linkedin.com/in/habibi-ahmad-aziz)
* Email (via form): tersedia di halaman **Contact Me**

```
