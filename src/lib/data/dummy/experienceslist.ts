export interface Experience {
    type: "experience" | "education";
    period: string;
    title: string;
    company: string;
    location: string;
    description: string;
    skills: string[];
    side: "left" | "right";
    highlight?: string;
  }

export const experiences: Experience[] = [
    {
      type: "experience",
      period: "Jun 2025 - Agu 2025 · 3 bln",
      title: "Cloud Computing Trainer Intern",
      company: "Yayasan Sagasitas Indonesia",
      location: "DKI Jakarta · On-site",
      description:
        "Mengajar Cloud Computing dan Generative AI di sekolah-sekolah. Membimbing praktik menggunakan AWS PartyRock, menyusun materi & lab hands-on, serta menjadi penghubung antara tim pengajar dan sekolah.",
      skills: ["Cloud Computing", "Generative AI", "AWS PartyRock", "Technical Teaching"],
      side: "left",
      highlight: "Latest Position",
    },
    {
      type: "experience",
      period: "Jan 2025 - Mei 2025 · 5 bln",
      title: "Web Developer Intern",
      company: "CV. SmartPlus Indonesia",
      location: "Karawang, Jawa Barat · Remote",
      description:
        "Fullstack Web Developer dalam pembuatan website proyek internal perusahaan. Fokus pada pengembangan end-to-end dengan teknologi modern.",
      skills: ["Fullstack Development", "React", "Laravel", "MySQL"],
      side: "right",
    },
    {
      type: "experience",
      period: "Jan 2025 - Apr 2025 · 4 bln",
      title: "Student Member",
      company: "Coding Camp powered by DBS Foundation",
      location: "Bandung, Jawa Barat · Remote",
      description:
        "Mendalami Full-Stack Development & Web Development. Proyek tim CultureConnect berhasil masuk Top 15 Best Capstone Project.",
      skills: ["Full-Stack Development", "Team Collaboration", "Project Management"],
      side: "left",
      highlight: "Top 15 Achievement",
    },
    {
      type: "experience",
      period: "Jun 2023 - Sekarang",
      title: "Student Assistant",
      company: "SMK Negeri 1 Karawang",
      location: "Karawang, Jawa Barat · On-site",
      description:
        "Mendukung aktivitas akademik & teknis sebagai asisten siswa paruh waktu. Membantu dalam kegiatan pembelajaran dan administrasi sekolah.",
      skills: ["Academic Support", "Teaching Assistance", "Organization"],
      side: "right",
    },
    {
      type: "education",
      period: "Jun 2023 - Jun 2026",
      title: "Rekayasa Perangkat Lunak",
      company: "SMK Negeri 1 Karawang",
      location: "Karawang, Jawa Barat",
      description:
        "Fokus pada pengembangan software, pemrograman, sistem komputer, dan teknologi jaringan. Aktif dalam berbagai proyek dan kompetisi teknologi.",
      skills: ["Software Engineering", "Network Technology", "Programming"],
      side: "left",
      highlight: "Current Study",
    },
    {
      type: "education",
      period: "Jul 2020 - Jun 2023",
      title: "Bahasa dan Sastra Arab",
      company: "MTSS Darunnadwah 01",
      location: "Karawang, Jawa Barat",
      description:
        "Mempelajari bahasa dan sastra Arab dengan fokus pada kemampuan linguistik dan pemahaman budaya. Mengembangkan keterampilan komunikasi dan analisis teks.",
      skills: ["Arabic Language", "Literature Analysis", "Cultural Studies"],
      side: "right",
    },
  ];