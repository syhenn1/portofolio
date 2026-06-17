import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiPhp,
  SiPython,
  SiDart,
  SiNextdotjs,
  SiReact,
  SiLaravel,
  SiCodeigniter,
  SiExpress,
  SiFlutter,
  SiTailwindcss,
  SiBootstrap,
  SiNodedotjs,
  SiFirebase,
  SiMysql,
  SiSqlite,
  SiPostgresql,
  SiMongodb,
  SiFigma,
  SiGithub,
  SiGit,
  SiDocker,
  SiNotion,
  SiJira,
} from "react-icons/si";
import type { IconType } from "react-icons";

export const statsData = [
  { n: "5+", label: "Projects Built", icon: "🚀" },
  { n: "5+", label: "Languages", icon: "💻" },
  { n: "3+", label: "Years Learning", icon: "📚" },
];

export const roles = [
  "Software Developer",
  "Flutter Developer",
  "Web Developer",
  "Data Analyst",
];

export const timelineData = [
  {
    year: "2023",
    color: "#10b981",
    title: "Politeknik Negeri Jakarta",
    desc: "Mulai mendalami ilmu teknologi informasi di program D4 Teknik Informatika.",
  },
  {
    year: "2024",
    color: "#06b6d4",
    title: "Computer Student Club",
    desc: "Bergabung KSM Club Komputer sebagai Software Developer, memimpin berbagai project.",
  },
  {
    year: "2025",
    color: "#f59e0b",
    title: "Expanding Skills",
    desc: "Memperdalam data science dan terus membangun project-project baru yang berdampak.",
  },
  {
    year: "Now",
    color: "#a78bfa",
    title: "Open to Opportunities",
    desc: "Terus belajar, membangun, dan siap berkontribusi dalam proyek-proyek inovatif.",
  },
];

export type Skill = { name: string; Icon?: IconType; src?: string };

export const skills: Record<string, Record<string, Skill>> = {
  "Programming Languages": {
    html: { name: "HTML5", Icon: SiHtml5 },
    css: { name: "CSS3", Icon: SiCss },
    js: { name: "JavaScript", Icon: SiJavascript },
    ts: { name: "TypeScript", Icon: SiTypescript },
    php: { name: "PHP", Icon: SiPhp },
    python: { name: "Python", Icon: SiPython },
    dart: { name: "Dart", Icon: SiDart },
  },
  "Frameworks & Technologies": {
    react: { name: "React", Icon: SiReact },
    nextjs: { name: "Next.js", Icon: SiNextdotjs },
    express: { name: "Express.js", Icon: SiExpress },
    laravel: { name: "Laravel", Icon: SiLaravel },
    ci4: { name: "CodeIgniter 4", Icon: SiCodeigniter },
    flutter: { name: "Flutter", Icon: SiFlutter },
    tailwind: { name: "Tailwind CSS", Icon: SiTailwindcss },
    bootstrap: { name: "Bootstrap", Icon: SiBootstrap },
    nodejs: { name: "Node.js", Icon: SiNodedotjs },
    firebase: { name: "Firebase", Icon: SiFirebase },
  },
  Databases: {
    mysql: { name: "MySQL", Icon: SiMysql },
    postgresql: { name: "PostgreSQL", Icon: SiPostgresql },
    mongodb: { name: "MongoDB", Icon: SiMongodb },
    sqlite: { name: "SQLite", Icon: SiSqlite },
    oracle: { name: "Oracle", src: "/images/Oracle-Symbol.png" },
  },
  "Tools & Platforms": {
    figma: { name: "Figma", Icon: SiFigma },
    github: { name: "GitHub", Icon: SiGithub },
    git: { name: "Git", Icon: SiGit },
    docker: { name: "Docker", Icon: SiDocker },
    notion: { name: "Notion", Icon: SiNotion },
    jira: { name: "Jira", Icon: SiJira },
    excel: { name: "Excel", src: "/images/icons8-excel-480.png" },
    word: { name: "Word", src: "/images/icons8-word-480.png" },
    ppt: { name: "PowerPoint", src: "/images/icons8-powerpoint-480.png" },
  },
  IDE: {
    vs: { name: "Visual Studio", src: "/images/icons8-visual-studio-480.png" },
    vsc: { name: "VS Code", src: "/images/icons8-visual-studio-code-2019-480.png" },
  },
};

export const categoryColors: Record<string, string> = {
  "Programming Languages": "#10b981",
  "Frameworks & Technologies": "#06b6d4",
  Databases: "#f59e0b",
  "Tools & Platforms": "#a78bfa",
  IDE: "#f97316",
};

export const getSkill = (key: string): Skill | null => {
  for (const cat in skills) {
    if (skills[cat][key]) return skills[cat][key];
  }
  return null;
};

export type Project = {
  slug: string;
  title: string;
  sub: string;
  category: string;
  year: string;
  role: string;
  desc: string;
  img: string;
  color: string;
  tech: string[];
  problem: string;
  solution: string;
  features: string[];
};

export const projects: Project[] = [
  {
    slug: "invensync",
    title: "InvenSync",
    sub: "Web App · Inventory System",
    category: "Web Application",
    year: "2024",
    role: "Lead Developer",
    desc: "Sistem Kasir dan Inventaris terintegrasi untuk UMKM. Multi-role, multi-user dengan batasan akses per pengelola.",
    img: "/images/invensync.png",
    color: "#10b981",
    tech: ["html", "css", "js", "tailwind", "php", "oracle", "figma", "jira"],
    problem:
      "UMKM sering mengelola kasir dan stok barang secara terpisah, sehingga data penjualan dan inventaris mudah tidak sinkron dan rawan kesalahan pencatatan manual.",
    solution:
      "InvenSync menyatukan sistem kasir (POS) dan manajemen inventaris dalam satu platform web, dengan kontrol akses multi-role agar pemilik dan karyawan punya hak akses sesuai tanggung jawab masing-masing.",
    features: [
      "Transaksi kasir real-time dengan cetak struk",
      "Stok otomatis tersinkron setiap transaksi",
      "Multi-role: Owner, Admin, dan Kasir dengan batasan akses",
      "Laporan penjualan & stok harian/bulanan",
      "Desain responsif untuk tablet & desktop",
    ],
  },
  {
    slug: "finder",
    title: "FinDer",
    sub: "Web App · Decision Support",
    category: "Decision Support System",
    year: "2024",
    role: "Full-Stack Developer",
    desc: "Sistem Pendukung Keputusan pemilihan ikan hias menggunakan metode MOORA berbasis web dengan Laravel.",
    img: "/images/finder.png",
    color: "#06b6d4",
    tech: ["php", "laravel", "mysql", "tailwind", "figma", "notion"],
    problem:
      "Pembudidaya ikan hias pemula sering kesulitan menentukan jenis ikan yang paling cocok untuk dibudidayakan karena banyaknya kriteria yang harus dipertimbangkan sekaligus.",
    solution:
      "FinDer adalah Sistem Pendukung Keputusan berbasis web yang menerapkan metode MOORA (Multi-Objective Optimization by Ratio Analysis) untuk merangking pilihan ikan hias berdasarkan kriteria dan bobot yang diinput pengguna.",
    features: [
      "Input & bobot kriteria custom oleh pengguna",
      "Perhitungan otomatis dengan metode MOORA",
      "Ranking hasil rekomendasi ikan hias",
      "Riwayat perhitungan tersimpan per pengguna",
      "Dibangun dengan Laravel + Tailwind CSS",
    ],
  },
  {
    slug: "mindcourse",
    title: "MindCourse",
    sub: "Mobile · Task Manager",
    category: "Mobile Application",
    year: "2025",
    role: "Mobile Developer",
    desc: "Flutter app manajemen tugas dan jadwal studi dengan SQLite lokal, offline-first dan clean UI.",
    img: "/images/mindcourse.png",
    color: "#f59e0b",
    tech: ["flutter", "sqlite"],
    problem:
      "Mahasiswa sering kesulitan mengatur jadwal kuliah, deadline tugas, dan progres belajar dalam satu tempat, terutama saat tidak ada koneksi internet.",
    solution:
      "MindCourse adalah aplikasi Flutter offline-first yang menyimpan data tugas dan jadwal secara lokal dengan SQLite, sehingga tetap bisa diakses kapan saja tanpa internet.",
    features: [
      "Manajemen tugas dengan deadline & prioritas",
      "Jadwal studi mingguan",
      "Penyimpanan lokal dengan SQLite (offline-first)",
      "Notifikasi pengingat tugas",
      "UI bersih dan minimalis",
    ],
  },
  {
    slug: "sharethem",
    title: "ShareThem",
    sub: "Mobile · P2P File Share",
    category: "Mobile Application",
    year: "2025",
    role: "Mobile Developer",
    desc: "Flutter app berbagi file peer-to-peer di jaringan lokal tanpa koneksi internet.",
    img: "/images/sharethem.png",
    color: "#a78bfa",
    tech: ["flutter", "firebase", "figma"],
    problem:
      "Berbagi file berukuran besar antar perangkat sering terhambat oleh keterbatasan kuota internet atau ketiadaan koneksi data di lokasi tertentu.",
    solution:
      "ShareThem memungkinkan pengguna berbagi file secara peer-to-peer melalui jaringan lokal (Wi-Fi) tanpa membutuhkan koneksi internet sama sekali.",
    features: [
      "Transfer file peer-to-peer via jaringan lokal",
      "Tidak memerlukan koneksi internet",
      "Mendukung berbagai jenis file",
      "Riwayat transfer file",
      "Dibangun dengan Flutter & Firebase",
    ],
  },
  {
    slug: "csc-website",
    title: "CSC Website",
    sub: "Web · Landing Page",
    category: "Landing Page",
    year: "2024",
    role: "Frontend Developer",
    desc: "Landing page profil Computer Student Club PNJ, dibangun dengan Next.js + Tailwind CSS.",
    img: "/images/csc.png",
    color: "#f97316",
    tech: ["nextjs", "tailwind", "figma"],
    problem:
      "Computer Student Club PNJ membutuhkan halaman profil online yang modern untuk memperkenalkan organisasi, divisi, dan program kerja kepada anggota maupun calon anggota.",
    solution:
      "Landing page modern dan responsif dibangun dengan Next.js dan Tailwind CSS, menampilkan profil organisasi, struktur divisi, dan kegiatan CSC secara menarik dan mudah dinavigasi.",
    features: [
      "Desain responsif & modern",
      "Section profil organisasi & divisi",
      "Showcase kegiatan & program kerja",
      "Optimasi performa dengan Next.js",
      "Animasi halus dengan Tailwind CSS",
    ],
  },
];

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const getAdjacentProjects = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return { prev, next };
};

export const socialLinks = {
  github: "https://github.com/syhenn1",
  linkedin: "https://linkedin.com/in/rifatsyahman/",
  email: "rifatsyahman@gmail.com",
};
