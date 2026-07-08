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
  SiOpenjdk,
  SiDotnet,
} from "react-icons/si";
import { FiFolder, FiCode, FiBookOpen } from "react-icons/fi";
import type { IconType } from "react-icons";
import { basePath } from "@/lib/basePath";

// Shared scroll pacing for every scroll-jacked "one item per screenful"
// section (JourneyTimeline, Projects) — same constant so their per-item
// scroll speed always matches; tune once here, not separately per section.
export const SCROLL_VH_PER_ITEM = 140;

export const statsData = [
  { n: "5+", label: "Projects Built", Icon: FiFolder },
  { n: "5+", label: "Languages", Icon: FiCode },
  { n: "3+", label: "Years Learning", Icon: FiBookOpen },
];

export const roles = [
  "Software Developer",
  "Flutter Developer",
  "Web Developer",
  "Data Analyst",
];

export const timelineData = [
  {
    year: "Sep 2023",
    color: "#8a8a86",
    title: "Politeknik Negeri Jakarta",
    desc: "Started the D4 Applied Bachelor's in Informatics Engineering (GPA 3.87/4.00), diving into web programming, databases, and AI coursework.",
    images: [{ src: `${basePath}/images/pnj-early.jpeg`, width: 900, height: 1600 }],
  },
  {
    year: "Jun 2024 – Nov 2024",
    color: "#cc5500",
    title: "Project Team Lead & Software Developer — Computer Student Club",
    desc: "Led a dev team building the club's business website with Next.js, keeping Git/GitHub workflows smooth and deployment-conflict-free — while growing through weekly club sessions.",
    images: [{ src: `${basePath}/images/csc-team.jpg`, width: 600, height: 800 }],
  },
  {
    year: "2025",
    color: "#a78bfa",
    title: "Research — Monitoring System with MultiModel Concept",
    desc: "Built a multi-model monitoring system end-to-end as Fullstack Developer — architecting the database, designing detection models from heterogeneous datasets, and shipping a Flask/MySQL-backed dashboard from Figma designs.",
    images: [
      { src: `${basePath}/images/sniv-landing.png`, width: 1919, height: 1079 },
      { src: `${basePath}/images/sniv-page1.png`, width: 900, height: 506 },
      { src: `${basePath}/images/sniv-page2.png`, width: 900, height: 506 },
      { src: `${basePath}/images/sniv-page3.png`, width: 900, height: 506 },
    ],
  },
  {
    year: "Sep 2025 – Jun 2026",
    color: "#ff6a00",
    title: "Data Verifier — Kementerian Pendidikan Dasar dan Menengah",
    desc: "Verified delivery and technical specs of assets — interactive panels, laptops, routers — for hardware compliance and inventory accuracy, and liaised with schools on connectivity feedback and reporting.",
    images: [{ src: `${basePath}/images/kemendik-team.jpg`, width: 900, height: 506 }],
  },
  {
    year: "Oct 2025 – Dec 2025",
    color: "#f59e0b",
    title: "Academic Division Staff — EXPECTIK",
    desc: "Organized games and missions for incoming students during EXPECTIK, the ICT Department's orientation event required for graduation.",
    images: [{ src: `${basePath}/images/expectik-pres.png`, width: 645, height: 842 }],
  },
  {
    year: "Dec 2025",
    color: "#10b981",
    title: "Project-Based Learning — Dinas Kesehatan Depok",
    desc: "Led end-to-end development of Delisa's midwife modules as Fullstack Developer & System Analyst — architecting the healthcare data schema and building the Next.js/TypeScript dashboard from Figma designs.",
    images: [
      { src: `${basePath}/images/delisa-landing.png`, width: 1919, height: 1079 },
      { src: `${basePath}/images/delisa-team.png`, width: 800, height: 800 },
    ],
  },
  {
    year: "Jun 2026",
    color: "#06b6d4",
    title: "Project-Based Learning — PT Nusa Tekno Global",
    desc: "Led KIRA from market validation to system architecture — a dual-engine FastAPI + Express backend feeding a Next.js/TypeScript dashboard that visualizes RUL predictions and asset-risk metrics.",
    images: [
      { src: `${basePath}/images/kira-landing.png`, width: 1280, height: 726 },
      { src: `${basePath}/images/kira-team.jpg`, width: 900, height: 506 },
    ],
  },
  {
    year: "Now",
    color: "#14140f",
    title: "Open to Opportunities",
    desc: "Always learning, building, and ready to contribute to innovative projects.",
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
    java: { name: "Java", Icon: SiOpenjdk },
    vbnet: { name: "VB.NET", Icon: SiDotnet },
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
    oracle: { name: "Oracle", src: `${basePath}/images/Oracle-Symbol.png` },
  },
  "Tools & Platforms": {
    figma: { name: "Figma", Icon: SiFigma },
    github: { name: "GitHub", Icon: SiGithub },
    git: { name: "Git", Icon: SiGit },
    docker: { name: "Docker", Icon: SiDocker },
    notion: { name: "Notion", Icon: SiNotion },
    jira: { name: "Jira", Icon: SiJira },
    excel: { name: "Excel", src: `${basePath}/images/icons8-excel-480.png` },
    word: { name: "Word", src: `${basePath}/images/icons8-word-480.png` },
    ppt: { name: "PowerPoint", src: `${basePath}/images/icons8-powerpoint-480.png` },
  },
  IDE: {
    vs: { name: "Visual Studio", src: `${basePath}/images/icons8-visual-studio-480.png` },
    vsc: { name: "VS Code", src: `${basePath}/images/icons8-visual-studio-code-2019-480.png` },
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
  screenshots?: string[];
};

export const projects: Project[] = [
  {
    slug: "kira",
    title: "KIRA",
    sub: "Web App · Predictive Maintenance",
    category: "Web Application",
    year: "2026",
    role: "Full-Stack Developer",
    desc: "Remaining Useful Life (RUL) prediction system for company assets based on maintenance history, with an NLP feature to summarize the dashboard.",
    img: `${basePath}/images/kira-landing.png`,
    color: "#06b6d4",
    tech: ["python", "nextjs", "tailwind", "postgresql"],
    problem:
      "Companies struggle to predict when their assets will fail, causing frequent unplanned downtime that disrupts operations and increases maintenance costs.",
    solution:
      "KIRA analyzes maintenance history to predict the Remaining Useful Life (RUL) of each asset, complete with an NLP feature that automatically summarizes insights from the prediction dashboard into an easy-to-understand narrative.",
    features: [
      "RUL prediction based on maintenance history",
      "Interactive analytics dashboard",
      "NLP auto-summarization of the dashboard",
      "Multi-category asset management",
      "Failure prediction notifications",
    ],
    screenshots: [
      `${basePath}/images/kira-page1.png`,
      `${basePath}/images/kira-page2.png`,
      `${basePath}/images/kira-page3.png`,
    ],
  },
  {
    slug: "delisa",
    title: "DELISA",
    sub: "Web App · Health System",
    category: "Web Application",
    year: "2025",
    role: "Full-Stack Developer",
    desc: "Information system for the Depok Health Department with 4 roles: Health Department, Hospital, Midwife, and Patient, for screening and referral workflows.",
    img: `${basePath}/images/delisa-landing.png`,
    color: "#10b981",
    tech: ["php", "laravel", "mysql", "tailwind", "figma"],
    problem:
      "The health screening workflow in Depok City was still done manually and separately across institutions, leaving patient data unintegrated and making the referral process slow.",
    solution:
      "DELISA integrates the entire health workflow into a single platform: patients perform screening, midwives issue referrals, hospitals record treatment, and the Health Department analyzes data in real time.",
    features: [
      "Multi-role: Health Department, Hospital, Midwife, Patient",
      "Online health screening by patients",
      "Automated referral system by midwives",
      "Treatment logging by hospitals",
      "Data analytics dashboard for the Health Department",
    ],
    screenshots: [
      `${basePath}/images/delisa-page1.png`,
      `${basePath}/images/delisa-page2.png`,
      `${basePath}/images/delisa-page3.png`,
    ],
  },
  {
    slug: "sniv",
    title: "SNIV",
    sub: "Computer Vision · Monitoring",
    category: "Computer Vision",
    year: "2025",
    role: "ML Engineer",
    desc: "Computer vision-based monitoring system for the National Vocational Innovation Seminar that detects student movement in class using YOLO.",
    img: `${basePath}/images/sniv-landing.png`,
    color: "#a78bfa",
    tech: ["python", "nextjs", "tailwind"],
    problem:
      "Monitoring student activity in class was still done manually by teachers, making it difficult to detect students who were unfocused or engaged in off-task activity.",
    solution:
      "SNIV uses YOLO as a pretrained model to detect and classify student movement in real time via camera, giving teachers insight into class focus and participation levels.",
    features: [
      "Real-time student movement detection",
      "YOLO as the pretrained model",
      "Class activity monitoring dashboard",
      "Student behavior classification",
      "Participation analysis reports",
    ],
    screenshots: [
      `${basePath}/images/sniv-page1.png`,
      `${basePath}/images/sniv-page2.png`,
      `${basePath}/images/sniv-page3.png`,
    ],
  },
  {
    slug: "finder",
    title: "FinDer",
    sub: "Web App · Decision Support",
    category: "Decision Support System",
    year: "2024",
    role: "Full-Stack Developer",
    desc: "Web-based Decision Support System for choosing ornamental fish using the MOORA method, built with Laravel.",
    img: `${basePath}/images/finder.png`,
    color: "#06b6d4",
    tech: ["php", "laravel", "mysql", "tailwind", "figma", "notion"],
    problem:
      "Beginner ornamental fish breeders often struggle to determine the best species to raise because of the many criteria that need to be weighed at once.",
    solution:
      "FinDer is a web-based Decision Support System that applies the MOORA (Multi-Objective Optimization by Ratio Analysis) method to rank ornamental fish choices based on criteria and weights entered by the user.",
    features: [
      "Custom criteria input & weighting by the user",
      "Automatic calculation with the MOORA method",
      "Ranked ornamental fish recommendations",
      "Calculation history saved per user",
      "Built with Laravel + Tailwind CSS",
    ],
  },
  {
    slug: "mindcourse",
    title: "MindCourse",
    sub: "Mobile · Task Manager",
    category: "Mobile Application",
    year: "2025",
    role: "Mobile Developer",
    desc: "Flutter app for managing tasks and study schedules with local SQLite storage, offline-first with a clean UI.",
    img: `${basePath}/images/mindcourse.png`,
    color: "#f59e0b",
    tech: ["flutter", "sqlite"],
    problem:
      "Students often struggle to manage class schedules, assignment deadlines, and study progress in one place, especially without an internet connection.",
    solution:
      "MindCourse is an offline-first Flutter app that stores task and schedule data locally with SQLite, so it stays accessible anytime without internet.",
    features: [
      "Task management with deadlines & priority",
      "Weekly study schedule",
      "Local storage with SQLite (offline-first)",
      "Task reminder notifications",
      "Clean, minimalist UI",
    ],
  },
  {
    slug: "sharethem",
    title: "ShareThem",
    sub: "Mobile · P2P File Share",
    category: "Mobile Application",
    year: "2025",
    role: "Mobile Developer",
    desc: "Flutter app for peer-to-peer file sharing over a local network without an internet connection.",
    img: `${basePath}/images/sharethem.png`,
    color: "#a78bfa",
    tech: ["flutter", "firebase", "figma"],
    problem:
      "Sharing large files between devices is often hampered by limited internet quota or the lack of a data connection in certain locations.",
    solution:
      "ShareThem lets users share files peer-to-peer over a local network (Wi-Fi) without needing any internet connection at all.",
    features: [
      "Peer-to-peer file transfer via local network",
      "No internet connection required",
      "Supports various file types",
      "File transfer history",
      "Built with Flutter & Firebase",
    ],
  },
  {
    slug: "invensync",
    title: "InvenSync",
    sub: "Web App · Inventory System",
    category: "Web Application",
    year: "2024",
    role: "Lead Developer",
    desc: "Integrated POS and Inventory system for small businesses. Multi-role, multi-user with per-manager access restrictions.",
    img: `${basePath}/images/invensync.png`,
    color: "#10b981",
    tech: ["html", "css", "js", "tailwind", "php", "oracle", "figma", "jira"],
    problem:
      "Small businesses often manage checkout and stock separately, causing sales and inventory data to easily fall out of sync and become prone to manual recording errors.",
    solution:
      "InvenSync unifies the point-of-sale (POS) system and inventory management into a single web platform, with multi-role access control so owners and employees each have access rights matching their responsibilities.",
    features: [
      "Real-time checkout transactions with receipt printing",
      "Stock automatically synced with every transaction",
      "Multi-role: Owner, Admin, and Cashier with access restrictions",
      "Daily/monthly sales & stock reports",
      "Responsive design for tablet & desktop",
    ],
  },
  {
    slug: "csc-website",
    title: "CSC Website",
    sub: "Web · Landing Page",
    category: "Landing Page",
    year: "2024",
    role: "Frontend Developer",
    desc: "Profile landing page for the PNJ Computer Student Club, built with Next.js + Tailwind CSS.",
    img: `${basePath}/images/csc.png`,
    color: "#f97316",
    tech: ["nextjs", "tailwind", "figma"],
    problem:
      "The PNJ Computer Student Club needed a modern online profile page to introduce the organization, its divisions, and work programs to both members and prospective members.",
    solution:
      "A modern, responsive landing page built with Next.js and Tailwind CSS, showcasing the organization's profile, division structure, and CSC activities in an engaging and easy-to-navigate way.",
    features: [
      "Responsive, modern design",
      "Organization & division profile sections",
      "Activities & work program showcase",
      "Performance optimized with Next.js",
      "Smooth animations with Tailwind CSS",
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
