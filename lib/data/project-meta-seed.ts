/**
 * One-time seed overrides merged into Supabase on `bun run seed:projects`.
 * Runtime reads role/outcome/description from the `projects` table.
 */
export type ProjectMetaSeed = {
  role?: string;
  description_en?: string;
  description_id?: string;
  outcome?: string;
};

const WEBEKSPRES_ROLE = "Web Developer (Webekspres team)";

export const PROJECT_META_SEED: Record<string, ProjectMetaSeed> = {
  "1408a39d-9eee-47a3-b939-27f48e868030": {
    role: "Full-stack developer",
    description_en:
      "School library records were split across notebooks and spreadsheets, so overdue books slipped through. I built Aksara Pustaka to track books, members, loans, returns, and stock in one place.",
    description_id:
      "Catatan perpustakaan sekolah tersebar di buku tulis dan spreadsheet, sehingga buku terlambat sering lolos. Saya membangun Aksara Pustaka untuk mencatat buku, anggota, peminjaman, pengembalian, dan stok di satu tempat.",
  },
  "f77d37fe-acaa-4491-8d47-2b9f434149a9": {
    role: "Full-stack developer",
    description_en:
      "School facility complaints lived on paper and in chats, and nobody knew whether a repair was queued or done. I built SiPadu so a report is filed once and its status is visible to everyone.",
    description_id:
      "Keluhan fasilitas sekolah tercecer di kertas dan chat, dan tak ada yang tahu apakah perbaikan sudah diantrekan atau selesai. Saya membangun SiPadu agar laporan cukup diajukan sekali dan statusnya terlihat semua pihak.",
  },
  "be97de22-b78b-4fed-8a3a-88dc23994d6c": {
    role: "Full-stack developer",
    description_en:
      "Manual parking check-in and check-out were hard to audit. I built a parking web app that covers entry, exit, reporting, and audit in one flow, without a heavyweight ERP.",
    description_id:
      "Pencatatan parkir masuk dan keluar secara manual sulit diaudit. Saya membangun aplikasi parkir web yang mencakup masuk, keluar, laporan, dan audit dalam satu alur, tanpa ERP yang berat.",
  },
  "fd57265a-c96e-40fe-98c4-4ace2a52b80c": {
    role: "Full-stack developer",
    description_en:
      "Schools tracked equipment loans in spreadsheets, so approvals stalled and returns went missing. I built Inventoryflow to handle inventory, loan requests, approvals, and returns with stock numbers people can trust.",
    description_id:
      "Sekolah mencatat peminjaman alat di spreadsheet, sehingga persetujuan macet dan pengembalian hilang. Saya membangun Inventoryflow untuk inventaris, pengajuan pinjam, persetujuan, dan pengembalian dengan stok yang bisa dipercaya.",
  },
  "169275ea-ca4a-4701-857f-1417fc4fec23": {
    role: "Full-stack developer",
    description_en:
      "Digital THR is usually a dull transfer form. I built BagiBerkah to make giving it playful with mini-games, while keeping allocation choices clear and the payment path real.",
    description_id:
      "THR digital biasanya cuma form transfer yang membosankan. Saya membangun BagiBerkah agar berbagi THR terasa seru lewat mini-game, dengan pilihan alokasi yang jelas dan alur pembayaran yang nyata.",
    outcome: "Live on Vercel",
  },
  "1dd8ca69-4921-4ca7-80e3-56177efaf499": {
    role: "Full-stack developer",
    description_en:
      "OSIS elections at SMKN 1 Karawang ran on paper ballots and manual tallies, with long queues and slow results. I built E-Vote so students vote on campus devices and results are ready when voting closes.",
    description_id:
      "Pemilihan OSIS di SMKN 1 Karawang memakai surat suara kertas dan hitung manual, dengan antrean panjang dan hasil yang lama. Saya membangun E-Vote agar siswa memilih lewat perangkat sekolah dan hasil siap begitu pemungutan ditutup.",
    outcome: "Live at SMKN 1 Karawang",
  },
  "bde24764-8fcf-4d67-8bb2-697cb57fb66d": {
    role: "Frontend & ML integration (team of 3)",
    description_en:
      "Smallholder farmers rarely get timely, local advice they can act on. In a team of three I built the web UI and ML integration for Smartfarm AI (Agrify), turning model output into practical advice.",
    description_id:
      "Petani kecil jarang mendapat saran lokal yang tepat waktu dan bisa langsung dipakai. Dalam tim bertiga saya membangun UI web dan integrasi ML Smartfarm AI (Agrify) yang mengubah output model jadi saran praktis.",
    outcome: "Intel AI Festival · Indonesia award (Agrify)",
  },
  "ff98b3c6-e267-4ee0-9059-9444858eacf4": {
    role: "Full-stack (capstone team)",
    description_en:
      "Travelers get generic itineraries that ignore local culture. With a distributed Coding Camp team I helped build CultureConnect, which recommends personal cultural experiences that support local communities.",
    description_id:
      "Wisatawan sering mendapat itinerary generik yang mengabaikan budaya lokal. Bersama tim Coding Camp lintas kota saya ikut membangun CultureConnect, yang merekomendasikan pengalaman budaya yang personal dan mendukung komunitas lokal.",
    outcome: "Coding Camp · Top 15 capstone",
  },
  "13e602b8-c324-44e6-9c61-e9e40f388394": {
    role: "Full-stack developer",
    description_en:
      "School schedules collided every semester: double-booked rooms and overlapping teachers. I built SpaceLab to catch those conflicts before a schedule goes public.",
    description_id:
      "Jadwal sekolah selalu bentrok tiap semester: ruang terpakai ganda dan guru tumpang tindih. Saya membangun SpaceLab untuk menangkap bentrokan itu sebelum jadwal diumumkan.",
    outcome: "School scheduling prototype",
  },
  "f5c13a15-1bc6-4e82-8d62-d1196894d189": {
    role: "Web developer intern (CV Smartplus)",
    description_en:
      "SMKN 1 Karawang students needed one place to find jobs. During PKL at CV Smartplus, my team and I built Renshuu, a job-search web app, against the company's brief and internship deadlines.",
    description_id:
      "Siswa SMKN 1 Karawang butuh satu tempat untuk mencari lowongan. Saat PKL di CV Smartplus, saya dan tim membangun Renshuu, aplikasi pencarian kerja, sesuai brief perusahaan dan tenggat magang.",
    outcome: "Internship ship with CV Smartplus",
  },
  "36b5bfa0-db1f-51cd-8861-8eac729f2afb": {
    role: WEBEKSPRES_ROLE,
    outcome: "Live at jepangku.com",
    description_en:
      "A Japan fan community needed a live portal, not a company-profile theme. On the Webekspres team I built reader modules, the admin CMS, quizzes, polls, and XP, plus shared auth with Core.",
    description_id:
      "Komunitas pecinta Jepang butuh portal yang hidup, bukan tema company profile. Bersama tim Webekspres saya membangun modul pembaca, CMS admin, kuis, polling, dan XP, plus auth bersama Core.",
  },
  "dfd144d5-84d7-5f1f-be03-1554dee928b1": {
    role: WEBEKSPRES_ROLE,
    outcome: "Web admin + mobile app on one API",
    description_en:
      "Bank sampah work (deposits, pickups, weigh-ins, balances) breaks down in spreadsheets once staff, coordinators, and the district share one queue. On the Webekspres team I built the MIRU-G web admin on the same API as the residents' mobile app, so every transaction stays in sync. Live in production at mirubanksampah.id.",
    description_id:
      "Operasional bank sampah (setoran, jemput, timbang, saldo) kacau di spreadsheet begitu petugas, koordinator, dan distrik berbagi satu antrean. Bersama tim Webekspres saya membangun admin web MIRU-G di atas API yang sama dengan aplikasi mobile nasabah, sehingga setiap transaksi tetap sinkron. Sudah berjalan di production di mirubanksampah.id.",
  },
  "ecbcd798-00c0-5c63-8b51-4a3ad1708fff": {
    role: WEBEKSPRES_ROLE,
    outcome: "Live on Vercel / luzinsworkshop.web.id",
    description_en:
      "A public-speaking academy needed a page that sells workshops, not a generic company profile. On the Webekspres team I built the landing page with packages, galleries, video, testimonials, and a WhatsApp CTA.",
    description_id:
      "Akademi public speaking butuh halaman yang menjual workshop, bukan company profile biasa. Bersama tim Webekspres saya membangun landing page dengan paket, galeri, video, testimoni, dan CTA WhatsApp.",
  },
  "d7401d61-cd67-5430-a574-122d35e61cc4": {
    role: WEBEKSPRES_ROLE,
    outcome: "Code shipped · client hosting still on default page",
    description_en:
      "A construction and trading company needed a site with a serious visual system. On the Webekspres team I built PT Mustika Galuh Cakrawala's site with TanStack Start. The build is done; ptmgc.co.id still shows the registrar page while DNS handover is pending.",
    description_id:
      "Perusahaan konstruksi dan perdagangan butuh situs dengan sistem visual yang serius. Bersama tim Webekspres saya membangun situs PT Mustika Galuh Cakrawala dengan TanStack Start. Build sudah selesai; ptmgc.co.id masih menampilkan halaman registrar karena serah terima DNS belum selesai.",
  },
  "73038783-8389-5626-8ab0-473f0b5284ae": {
    role: WEBEKSPRES_ROLE,
    outcome: "Live at hatta.web.id",
    description_en:
      "Consulting is sold on trust in the people behind it. I worked on PT Hatta Global Partner's landing page, built around client pain points in ISO, SOP, and leadership training, and set up the hosting firewall.",
    description_id:
      "Jasa konsultan dijual lewat kepercayaan pada orang di baliknya. Saya ikut mengerjakan landing page PT Hatta Global Partner yang berangkat dari masalah klien soal ISO, SOP, dan pelatihan kepemimpinan, serta mengatur firewall hosting.",
  },
  "67978780-65a3-4a1a-94e6-60a0bd354b72": {
    role: WEBEKSPRES_ROLE,
    outcome: "Live at triply.co.id",
    description_en:
      "Trips go wrong in the details nobody writes down. On the Webekspres team I built Triply's site with written include and exclude lists, transparent pricing, and WhatsApp enquiry for open trips and private, campus, and corporate groups.",
    description_id:
      "Perjalanan sering bermasalah di detail yang tidak pernah ditulis. Bersama tim Webekspres saya membangun situs Triply dengan daftar include dan exclude tertulis, harga transparan, dan enquiry WhatsApp untuk open trip serta grup private, kampus, dan korporat.",
  },
  "1636bd61-2b93-4fb0-b6ea-d6456dbf77ea": {
    role: WEBEKSPRES_ROLE,
    outcome: "Live at subulussalaminsanglobal.com",
    description_en:
      "Groups renting a bus want to see the real fleet and get a quick quote. On the Webekspres team I built Subulussalam Insan Global's site with fleet listings, an on-location gallery, a three-step booking flow, and WhatsApp consultation.",
    description_id:
      "Rombongan yang menyewa bus ingin melihat armada asli dan cepat dapat harga. Bersama tim Webekspres saya membangun situs Subulussalam Insan Global dengan daftar armada, galeri lokasi, alur booking tiga langkah, dan konsultasi WhatsApp.",
  },
  "08ad34a3-c3f9-4630-817e-e08140f6b0ad": {
    role: WEBEKSPRES_ROLE,
    outcome: "Live at louisepilates.com",
    description_en:
      "Boutique studios lose bookings when customers must register and remember a password. On the Webekspres team I built Louise Pilates' site with booking through email verification, no account needed.",
    description_id:
      "Studio butik kehilangan booking saat pelanggan dipaksa daftar dan mengingat password. Bersama tim Webekspres saya membangun situs Louise Pilates dengan booking lewat verifikasi email, tanpa perlu akun.",
  },
  "2ca2341f-449d-5b44-a919-f628586fed79": {
    description_en:
      "Foreign buyers hesitate over land ownership and title checks. I worked on a West Sumbawa land-investment site that answers those questions up front: plot catalog, detail pages, guides, and a multilingual UI.",
    description_id:
      "Calon investor asing ragu soal legalitas kepemilikan dan sertifikat tanah. Saya ikut mengerjakan situs investasi lahan Sumbawa Barat yang menjawabnya sejak awal: katalog kavling, halaman detail, panduan, dan UI multibahasa.",
  },
  "ebd04466-7e2e-55a3-9705-e41d013a359f": {
    description_en:
      "Buyers rarely know which forklift spec fits their site, so a plain product list does not sell. I worked on a catalog of new and used units, batteries, and chargers that leads into a WhatsApp consultation.",
    description_id:
      "Pembeli jarang tahu spesifikasi forklift yang cocok, jadi daftar produk biasa tidak cukup. Saya ikut mengerjakan katalog unit baru dan bekas, baterai, serta charger yang mengarahkan ke konsultasi WhatsApp.",
  },
  "d62e4264-031d-5926-8b5f-a8c67bb2daac": {
    description_en:
      "Local tourism and UMKM listings were scattered across chats and one-off posts. On the Webekspres team I developed Terraju, one public directory for destinations, coffee shops, local businesses, and souvenir centers.",
    description_id:
      "Info wisata dan UMKM lokal tercecer di chat dan unggahan lepas. Bersama tim Webekspres saya mengembangkan Terraju, satu direktori publik untuk destinasi, kedai kopi, usaha lokal, dan pusat oleh-oleh.",
  },
  "4c336b3b-5898-5ad5-bed3-239f972f5814": {
    description_en:
      "A company with many unrelated services risked looking unfocused online. I worked on PT Razka Karya Nusantara's site, which presents entertainment, travel, staffing, consulting, and auto parts as one business, plus an activity log.",
    description_id:
      "Perusahaan dengan banyak lini layanan berisiko terlihat tidak fokus. Saya ikut mengerjakan situs PT Razka Karya Nusantara yang menyajikan hiburan, travel, staffing, konsultan, dan suku cadang sebagai satu bisnis, plus modul dokumentasi kegiatan.",
  },
  "e2c181c4-e4c2-5546-8303-a14f27aaa90a": {
    description_en:
      "Corporate gift buyers want to browse by product and picture their logo before asking for a quote. I worked on Giftara's souvenir catalog with categories, an order flow, and a portfolio gallery.",
    description_id:
      "Pembeli souvenir perusahaan ingin menelusuri per produk dan membayangkan logonya sebelum minta penawaran. Saya ikut mengerjakan katalog souvenir Giftara dengan kategori, alur pemesanan, dan galeri portofolio.",
  },
  "ea4a35c1-5f60-5c8d-94d7-f0877fb2bfd1": {
    description_en:
      "Overseas partners pick a trading company on reliability and reach. I worked on Indatu's bilingual (ID and EN) trading and shipping site with a product catalog and Google Analytics.",
    description_id:
      "Mitra luar negeri memilih perusahaan dagang dari keandalan dan jangkauannya. Saya ikut mengerjakan situs dagang dan pengiriman Indatu dalam dua bahasa (ID dan EN) dengan katalog produk dan Google Analytics.",
  },
  "69aeb916-9cfc-56b0-976b-88ee634f93b6": {
    description_en:
      "Industrial buyers need proof of precision before trusting a parts supplier. I worked on CV Karya Yudita Baroqah's site, which shows its metal casting and marine spare-part work, plus branding and logo assets.",
    description_id:
      "Pembeli industri butuh bukti presisi sebelum percaya pada pemasok suku cadang. Saya ikut mengerjakan situs CV Karya Yudita Baroqah yang menampilkan pengecoran logam dan suku cadang kapal, lengkap dengan aset branding dan logo.",
  },
  "243b5551-81aa-598a-991d-4b55dbbfc259": {
    description_en:
      "Companies clearing assets want a fair price and a safe removal, not an informal scrap dealer. I worked on Jatim Utama's scrap-metal and demolition site with working SMTP contact forms and Open Graph assets.",
    description_id:
      "Perusahaan yang melepas aset ingin harga wajar dan pembongkaran aman, bukan pengepul informal. Saya ikut mengerjakan situs besi tua dan pembongkaran Jatim Utama dengan form kontak SMTP dan aset Open Graph.",
  },
  "9e5f8eb2-4964-5c5f-84d2-93c3b0a9bc1d": {
    description_en:
      "A craft brand lives on a consistent look. I worked on Aisyn Craft's catalog for upcycled floral arrangements, home decor, and artisanal merch, together with the UI design system behind it.",
    description_id:
      "Brand kerajinan hidup dari tampilan yang konsisten. Saya ikut mengerjakan katalog Aisyn Craft untuk rangkaian bunga daur ulang, dekorasi rumah, dan merchandise artisan, bersama design system UI-nya.",
  },
  "20479cf8-542e-5223-8ff5-350d001e19a7": {
    description_en:
      "In-home spa customers need to trust the service and book without friction. I worked on Soraya Spa Massage Batam's site with a treatment menu, coverage area, and a WhatsApp booking flow.",
    description_id:
      "Pelanggan spa panggilan perlu yakin pada layanannya dan bisa memesan tanpa ribet. Saya ikut mengerjakan situs Soraya Spa Massage Batam dengan menu perawatan, area layanan, dan alur booking via WhatsApp.",
  },
  "c21994a4-0ab1-55e0-bab9-1d1d200f0a6f": {
    description_en:
      "Parents choosing a boarding school weigh values, curriculum, and how to enrol. I worked on Pondok Pesantren Ittihadiyah Tanreassona Pinrang's site with its profile, news, student achievements, and PPDB admissions.",
    description_id:
      "Orang tua yang memilih pesantren menimbang nilai, kurikulum, dan cara mendaftar. Saya ikut mengerjakan situs Pondok Pesantren Ittihadiyah Tanreassona Pinrang dengan profil, berita, prestasi santri, dan pendaftaran PPDB.",
  },
  "00f837eb-3fa1-5848-bce3-b2d35d4dc9f2": {
    description_en:
      "Families planning to study abroad need a consultant they can trust for the whole journey. I worked on Edu Global Academy's site with program pages, articles, FAQ, and partner logos, including its UKM Malaysia partnership.",
    description_id:
      "Keluarga yang merencanakan kuliah ke luar negeri butuh konsultan yang bisa dipercaya dari awal sampai akhir. Saya ikut mengerjakan situs Edu Global Academy dengan halaman program, artikel, FAQ, dan logo mitra, termasuk kemitraan UKM Malaysia.",
  },
  "25d41ace-dab0-5ddf-8e3b-3b8024ee4e27": {
    description_en:
      "Travel buyers compare packages and want proof an agency is legitimate. I worked on PT Anugrah Tour and Travel's Sampit site so tours, Umrah, tickets, hotels, and car hire are easy to compare on any screen.",
    description_id:
      "Calon pelanggan travel membandingkan paket dan ingin bukti agensinya resmi. Saya ikut mengerjakan situs PT Anugrah Tour and Travel Sampit agar tur, umrah, tiket, hotel, dan sewa mobil mudah dibandingkan di layar apa pun.",
  },
  "0178ba6c-a506-5401-819e-1bb3d2a1c397": {
    description_en:
      "Contractors win work on proven capability. I worked on a Ciawi-Bogor hotmix contractor site that shows paving, overlay, and patching work with a project portfolio and a free-survey request.",
    description_id:
      "Kontraktor mendapat proyek dari bukti kemampuan. Saya ikut mengerjakan situs kontraktor hotmix Ciawi-Bogor yang menampilkan pengaspalan, overlay, dan tambal jalan dengan portofolio proyek dan permintaan survei gratis.",
  },
  "93035eae-5c29-5981-b285-a18e45c9eeb3": {
    role: WEBEKSPRES_ROLE,
    outcome: "Live at mediaumkm.com",
    description_en:
      "Small-business owners need news on financing, policy, and marketing that speaks to them, not general headlines. I worked on MediaUMKM, a news portal with eight UMKM beats, an advertising page, and the press-ethics pages an Indonesian news site is required to publish.",
    description_id:
      "Pelaku UMKM butuh berita soal pembiayaan, kebijakan, dan pemasaran yang relevan untuk mereka, bukan berita umum. Saya ikut mengerjakan MediaUMKM, portal berita dengan delapan rubrik UMKM, halaman pasang iklan, dan halaman etika pers yang wajib dimiliki media siber Indonesia.",
  },
};

export { WEBEKSPRES_ROLE };
