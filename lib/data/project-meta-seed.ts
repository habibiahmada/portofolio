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
      "I built a web library system to manage books, members, loans, returns, stock, and history in one place.",
    description_id:
      "Saya membangun sistem perpustakaan web untuk mengelola buku, anggota, peminjaman, pengembalian, stok, dan riwayat dalam satu tempat.",
  },
  "f77d37fe-acaa-4491-8d47-2b9f434149a9": {
    role: "Full-stack developer",
    description_en:
      "I built SiPadu so school facility reports can be filed and tracked in real time instead of disappearing into paper trails.",
    description_id:
      "Saya membangun SiPadu agar laporan fasilitas sekolah bisa diajukan dan dilacak real-time, bukan hilang di jejak kertas.",
  },
  "be97de22-b78b-4fed-8a3a-88dc23994d6c": {
    role: "Full-stack developer",
    description_en:
      "I built a parking web app for check-in, check-out, reporting, and audit in one flow.",
    description_id:
      "Saya membangun aplikasi parkir web untuk check-in, check-out, pelaporan, dan audit dalam satu alur.",
  },
  "fd57265a-c96e-40fe-98c4-4ace2a52b80c": {
    role: "Full-stack developer",
    description_en:
      "I built Inventoryflow to handle school/lab equipment loans, inventory, approvals, and returns, without spreadsheet chaos.",
    description_id:
      "Saya membangun Inventoryflow untuk peminjaman alat sekolah/lab, inventaris, persetujuan, dan pengembalian, tanpa kekacauan spreadsheet.",
  },
  "169275ea-ca4a-4701-857f-1417fc4fec23": {
    role: "Full-stack developer",
    description_en:
      "I built BagiBerkah, a digital THR experience with mini-games and smarter allocation recommendations.",
    description_id:
      "Saya membangun BagiBerkah, pengalaman THR digital dengan mini-game dan rekomendasi alokasi yang lebih cerdas.",
    outcome: "Live on Vercel",
  },
  "1dd8ca69-4921-4ca7-80e3-56177efaf499": {
    role: "Full-stack developer",
    description_en:
      "I built E-Vote so students can run digital OSIS elections with confidence, from ballots to real-time results.",
    description_id:
      "Saya membangun E-Vote agar siswa bisa menjalankan pemilihan OSIS digital dengan percaya diri, dari surat suara hingga hasil real-time.",
    outcome: "Live at SMKN 1 Karawang",
  },
  "bde24764-8fcf-4d67-8bb2-697cb57fb66d": {
    role: "Frontend & ML integration (team of 3)",
    description_en:
      "On a team project, I helped ship Smartfarm AI, combining modern web UI with ML-assisted insights for Indonesian farmers.",
    description_id:
      "Dalam proyek tim, saya membantu menghadirkan Smartfarm AI, menggabungkan UI web modern dengan insight berbantuan ML untuk petani Indonesia.",
    outcome: "Intel AI Festival · Indonesia award (Agrify)",
  },
  "ff98b3c6-e267-4ee0-9059-9444858eacf4": {
    role: "Full-stack (capstone team)",
    description_en:
      "With a distributed team, I helped build CultureConnect, an AI platform for more personal, community-aware cultural travel.",
    description_id:
      "Bersama tim terdistribusi, saya membantu membangun CultureConnect, platform AI untuk wisata budaya yang lebih personal dan berdampak bagi komunitas.",
    outcome: "Coding Camp · Top 15 capstone",
  },
  "13e602b8-c324-44e6-9c61-e9e40f388394": {
    role: "Full-stack developer",
    description_en:
      "I built Spacelab to keep school schedules, rooms, and teachers conflict-free without spreadsheet chaos.",
    description_id:
      "Saya membangun Spacelab agar jadwal, ruangan, dan guru sekolah bebas konflik tanpa kekacauan spreadsheet.",
    outcome: "School scheduling prototype",
  },
  "f5c13a15-1bc6-4e82-8d62-d1196894d189": {
    role: "Web developer intern (CV Smartplus)",
    description_en:
      "During PKL at CV Smartplus, my team and I built Renshuu, a job-search web app assigned for SMKN 1 Karawang students.",
    description_id:
      "Saat PKL di CV Smartplus, saya dan tim mengerjakan Renshuu, aplikasi pencarian kerja yang ditugaskan untuk siswa SMKN 1 Karawang.",
    outcome: "Internship ship with CV Smartplus",
  },
  "36b5bfa0-db1f-51cd-8861-8eac729f2afb": {
    role: WEBEKSPRES_ROLE,
    outcome: "Live at jepangku.com",
  },
  "dfd144d5-84d7-5f1f-be03-1554dee928b1": {
    role: WEBEKSPRES_ROLE,
    outcome: "Admin + API integration · domain not public yet",
  },
  "ecbcd798-00c0-5c63-8b51-4a3ad1708fff": {
    role: WEBEKSPRES_ROLE,
    outcome: "Live on Vercel / luzinsworkshop.web.id",
  },
  "d7401d61-cd67-5430-a574-122d35e61cc4": {
    role: WEBEKSPRES_ROLE,
    outcome: "Code shipped · client hosting still on default page",
  },
  "73038783-8389-5626-8ab0-473f0b5284ae": {
    role: WEBEKSPRES_ROLE,
    outcome: "Live at hatta.web.id",
  },
};

export { WEBEKSPRES_ROLE };
