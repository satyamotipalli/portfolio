// All site content lives here so copy edits never require touching components.
// Structure mirrors a Products / Projects / Roadmap / Blog / Stack / Sandbox layout.

import generatedPosts from "./posts.generated.json";

// Career start: April 2022. Years of experience is computed from this date so the
// number stays correct over time (recomputed on each build/deploy) — never hardcode it.
const CAREER_START = new Date(2022, 3, 1); // month is 0-indexed: 3 = April
function fullYearsSince(start: Date): number {
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const monthDelta = now.getMonth() - start.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < start.getDate())) {
    years -= 1;
  }
  return Math.max(years, 0);
}
export const YEARS_EXPERIENCE = fullYearsSince(CAREER_START); // e.g. 4

export const profile = {
  name: "Satyanarayana Veera Venkata Motipalli",
  shortName: "Satyanarayana Motipalli",
  handle: "satya",
  title: "Full-Stack & AI Engineer",
  tagline: "Building scalable web apps across Angular, React & Node.js — now with AI woven in.",
  location: "India",
  email: "Satyanarayanamotipallivv@gmail.com",
  phone: "+91 8328430029",
  github: "https://github.com/Satyavv2",
  linkedin: "https://www.linkedin.com/in/satyanarayanavvm/",
  careerStart: "April 2022",
  yearsExperience: `${YEARS_EXPERIENCE}+`,
};

export const nav = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Blog", href: "#blog" },
  { label: "Stack", href: "#stack" },
  { label: "Sandbox", href: "#sandbox" },
  { label: "Contact", href: "#contact" },
];

export const about = {
  summary: [
    `Full-stack developer with ${YEARS_EXPERIENCE}+ years delivering production IT projects end to end — requirement analysis, design, development, testing, deployment, and production support across multiple verticals.`,
    "I build dynamic, scalable user interfaces with Angular (8–19), React, TypeScript and Next.js, and back them with RESTful services in Node.js and NestJS — using connection pooling and clean architecture for performance.",
    "Increasingly focused on AI integration: building intelligent, context-aware agents and AI-driven features with LangChain and the OpenAI API.",
  ],
  stats: [
    { value: `${YEARS_EXPERIENCE}+`, label: "Years experience" },
    { value: "7", label: "Projects delivered" },
    { value: "Angular 8–19", label: "& React / Next.js" },
    { value: "AI", label: "LangChain · OpenAI" },
  ],
  education: {
    degree: "B.Com (Computers)",
    school: "Adikavi Nannaya University, Rajamahendravaram",
    year: "2017",
  },
};

// ── Products: shipped / flagship offerings shown as a 3-up grid ──────────────
export type Product = {
  name: string;
  blurb: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  details: string[];
};

export const products: Product[] = [
  {
    name: "Nutri AI",
    blurb:
      "Doctor-supervised diet engine. Patients upload health reports; LangChain agents generate personalized plans under a doctor's logic.",
    tech: ["React", "Python", "LangChain", "OpenAI", "MongoDB"],
    metrics: [
      { label: "LLM", value: "OpenAI" },
      { label: "Agents", value: "LangChain" },
      { label: "Store", value: "MongoDB" },
    ],
    details: [
      "End-to-end OpenAI + LangChain workflow for diet automation.",
      "Prompt-engineering for accurate, context-aware output.",
      "Secure health-data and response logging.",
    ],
  },
  {
    name: "Gen AI Concierge",
    blurb:
      "Natural-language data assistant — query databases in plain English, upload files, and get SQL-conversion plus unstructured analysis.",
    tech: ["Angular 17", "Python", "MySQL", "NLP"],
    metrics: [
      { label: "UI", value: "Angular 17" },
      { label: "NLP", value: "Custom" },
      { label: "DB", value: "MySQL" },
    ],
    details: [
      "Natural-language → SQL query conversion.",
      "Signal-driven inter-component communication.",
      "Deferred view loading for performance.",
    ],
  },
  {
    name: "AP Police Hackathon Portal",
    blurb:
      "End-to-end event platform — team/volunteer/guest registration, approval workflows, and an analytics-rich admin console. Built solo.",
    tech: ["React", "Node.js", "MySQL", "REST"],
    metrics: [
      { label: "Scope", value: "Solo" },
      { label: "Roles", value: "3 flows" },
      { label: "Admin", value: "Dashboards" },
    ],
    details: [
      "Conditional Company / Professional / Student flows.",
      "Admin dashboard with daily & category reports.",
      "Auth + edit-access control for approved teams.",
    ],
  },
];

// ── Projects: detailed case-study cards ─────────────────────────────────────
export type Project = {
  name: string;
  role?: string;
  period: string;
  client?: string;
  summary: string;
  tech: string[];
  highlights: string[];
  terminal: string[]; // mini-terminal lines shown on the card
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "Pathsaathi — School ERP Platform",
    client: "Ampersand Group",
    period: "May 2026 — Present",
    summary:
      "Multi-vertical education & skilling platform serving admins, teachers, students, parents and industry partners across centres in India — admissions, finance, attendance, transport, LMS and vocational skilling end to end.",
    tech: ["Next.js", "React", "NestJS", "Strapi", "TypeScript", "MongoDB", "PostgreSQL", "Kafka"],
    highlights: [
      "Built admin, teacher and student modules on Next.js 13 / React with reusable hooks.",
      "RBAC via Strapi with dynamic permission resolution and menu rendering.",
      "Business logic across Admissions, Finance, Academics and LMS verticals.",
      "Integrated RESTful services bridging multiple back-ends.",
    ],
    terminal: [
      "$ pathsaathi --verticals",
      "↳ admissions · finance · academics",
      "↳ lms · skilling   [5 modules]",
      "$ rbac.resolve(role) → menu ✓",
    ],
    featured: true,
  },
  {
    name: "Tax Litigation Management",
    client: "Deloitte",
    role: "Angular Developer",
    period: "Jun 2022 — Jan 2026",
    summary:
      "Deloitte's Direct & Indirect Tax litigation tool — a role-based platform where stakeholders run reports and perform tax-management activities by permission.",
    tech: ["Angular 12", "PrimeNG", ".NET (C#)", "PostgreSQL", "Power BI", "MSAL"],
    highlights: [
      "Integrated MSAL for secure authentication and login.",
      "Excel exports, file uploads and dynamic form-array builders.",
      "Custom pipes, directives and utility services for reuse.",
      "Power BI reporting; Azure Boards/Repos for delivery.",
    ],
    terminal: [
      "$ auth --provider msal",
      "↳ login ok · role=reviewer",
      "$ export --xlsx report.q3",
      "↳ 12,480 rows → file ✓",
    ],
    featured: true,
  },
  {
    name: "AP Police Hackathon Portal",
    role: "Full-Stack (solo)",
    period: "Jun 2025 — Jul 2025",
    summary:
      "End-to-end portal managing registration, approval and reporting for the AP Police Hackathon — company teams, professionals, students, volunteers and guests with a powerful admin console.",
    tech: ["React", "Node.js", "MySQL", "REST APIs"],
    highlights: [
      "Solely responsible for the entire application, front to back.",
      "Conditional Company / Professional / Student registration flows.",
      "Admin dashboard for approvals, reports and live charts.",
      "Auth and edit-access for approved members.",
    ],
    terminal: [
      "$ register --type student",
      "↳ team #214 pending approval",
      "$ admin approve 214",
      "↳ notified · login enabled ✓",
    ],
    featured: true,
  },
  {
    name: "Nutri AI — Diet Recommendations",
    role: "AI / Full-Stack",
    period: "Jan 2025 — Sep 2025",
    summary:
      "Doctor-patient platform where patients upload health reports and receive LLM-generated personalized diet plans under a doctor's observation.",
    tech: ["React", "Python", "LangChain", "OpenAI", "MongoDB"],
    highlights: [
      "End-to-end OpenAI + LangChain diet-automation workflow.",
      "Agents parse inputs and generate doctor-guided plans.",
      "Prompt-engineering for context-aware output.",
      "Secured health data and logs in MongoDB.",
    ],
    terminal: [
      "$ agent.run(report.pdf)",
      "↳ parsed 14 markers",
      "$ llm.plan(diet, doctorRules)",
      "↳ 7-day plan generated ✓",
    ],
  },
  {
    name: "Gen AI",
    role: "Angular Developer",
    period: "Mar 2024 — Aug 2024",
    summary:
      "AI platform for natural-language queries and file uploads — SQL-query conversion and unstructured-data analysis showcasing NLP and DB integration.",
    tech: ["Angular 17", "Python", "MySQL", "NLP"],
    highlights: [
      "Modular Angular 17 components with conditional rendering.",
      "Robust signal handling for inter-component communication.",
      "Deferred view loading for performance.",
      "Owned design through deployment.",
    ],
    terminal: [
      '$ ask "top 5 clients by revenue"',
      "↳ SQL generated · executed",
      "↳ 5 rows · chart rendered ✓",
    ],
  },
  {
    name: "Help Desk — Support Portal",
    client: "Sparity (internal)",
    period: "Nov 2023 — Apr 2024",
    summary:
      "Internal ticket-management portal streamlining employee service requests through a PM approval workflow routed to Admin, HR and IT.",
    tech: ["Angular", "Node.js", "SQL", "REST APIs"],
    highlights: [
      "Role-based interfaces for Employees, PMs, Admins, HR, IT.",
      "Node.js APIs for the full ticket lifecycle and auth.",
      "Connection pooling for SQL consistency and performance.",
      "Reusable Angular components for form handling.",
    ],
    terminal: [
      "$ ticket create --type hardware",
      "↳ #HD-882 → PM approval",
      "$ route → IT services",
      "↳ status: in-progress ✓",
    ],
  },
  {
    name: "EBMS — Electricity Billing",
    client: "BEDC, Nigeria",
    role: "Angular Developer",
    period: "May 2022 — Oct 2022",
    summary:
      "Electricity billing management for Benin Electricity Distribution Company — consumer, billing and payment modules, revamped to add prepaid alongside post-paid.",
    tech: ["Angular", "TypeScript", "REST APIs", "Web Services"],
    highlights: [
      "Active across requirements, design, dev, testing, debugging.",
      "Custom pipes, directives and utility services.",
      "Business logic across consumer, billing and payments.",
      "RESTful service integration front-to-back.",
    ],
    terminal: [
      "$ bill.generate(meter#A19)",
      "↳ tariff applied · ₦ 8,420",
      "$ payment --mode prepaid",
      "↳ receipt #PP-77 ✓",
    ],
  },
];

// ── Experience ──────────────────────────────────────────────────────────────
export const experience = {
  company: "Sparity Soft Technology Pvt. Ltd.",
  role: "Software Developer",
  period: "2022 — Present",
  blurb:
    "Delivering full-stack web applications for clients across tax, internal tooling, government, energy, education and AI — owning features from requirements through deployment in Agile (Scrum) teams.",
  highlights: [
    "Full-stack delivery across Angular / React / Next.js and Node.js / NestJS.",
    "Built reusable component libraries, pipes, directives, hooks and services.",
    "Integrated secure auth (MSAL, RBAC) and RESTful services across production apps.",
    "Drove AI integration with LangChain and OpenAI — agents and LLM workflows.",
  ],
};

// ── Roadmap: a learning / mastery track shown as a numbered list ─────────────
export type RoadmapItem = { n: string; title: string; done?: boolean };

export const roadmap: RoadmapItem[] = [
  { n: "01", title: "JavaScript & TypeScript foundations", done: true },
  { n: "02", title: "Angular architecture (8 → 19)", done: true },
  { n: "03", title: "React & Next.js app router", done: true },
  { n: "04", title: "Node.js & NestJS REST services", done: true },
  { n: "05", title: "SQL, PostgreSQL & connection pooling", done: true },
  { n: "06", title: "MongoDB & NoSQL modelling", done: true },
  { n: "07", title: "Auth: MSAL, JWT & RBAC", done: true },
  { n: "08", title: "Prompt engineering & LLM basics", done: true },
  { n: "09", title: "LangChain agents & tool use", done: true },
  { n: "10", title: "RAG pipelines & vector stores", done: false },
  { n: "11", title: "Event streaming with Kafka", done: false },
  { n: "12", title: "Cloud deploy & CI/CD at scale", done: false },
];

// ── Stack: tools grouped by category (the "uses" page) ───────────────────────
export type SkillGroup = { label: string; items: string[] };

export const skills: SkillGroup[] = [
  { label: "Frontend", items: ["Angular (8–19)", "React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "PrimeNG"] },
  { label: "Backend", items: ["Node.js", "NestJS", "Python", "Strapi", "REST APIs"] },
  { label: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "SQL", "Connection Pooling"] },
  { label: "AI & Automation", items: ["LangChain", "OpenAI API", "Intelligent Agents", "NLP", "Prompt Engineering"] },
  { label: "Cloud & DevOps", items: ["Azure DevOps", "Azure Boards", "Azure Repos", "Azure Pipelines", "Git", "Kafka"] },
  { label: "Tools & Practice", items: ["VS Code", "Postman", "Swagger", "Power BI", "Agile (Scrum)", "Waterfall"] },
];

// ── Blog ──────────────────────────────────────────────────────────────────
// Real posts come from the LinkedIn scraper (scraper/ → lib/posts.generated.json).
// If that file is empty, we fall back to these placeholder posts.
export type Post = { title: string; date: string; tag: string; excerpt: string; href: string };

const placeholderPosts: Post[] = [
  {
    title: "From Angular 8 to 19: what actually changed",
    date: "2026-05-02",
    tag: "Frontend",
    excerpt: "Signals, standalone components and the build pipeline — a migration field guide.",
    href: "#",
  },
  {
    title: "Wiring LangChain agents into a real product",
    date: "2026-04-18",
    tag: "AI",
    excerpt: "Lessons from Nutri AI: tool design, prompt structure and guarding LLM output.",
    href: "#",
  },
  {
    title: "Node.js connection pooling that doesn't fall over",
    date: "2026-03-11",
    tag: "Backend",
    excerpt: "Tuning pool size, timeouts and retries for high-throughput SQL workloads.",
    href: "#",
  },
];

const scrapedPosts = generatedPosts as Post[];
export const posts: Post[] = scrapedPosts.length > 0 ? scrapedPosts : placeholderPosts;

// ── Sandbox: experiments / playground ────────────────────────────────────────
export type Experiment = { name: string; desc: string; status: string };

export const sandbox: Experiment[] = [
  { name: "rag-notes", desc: "Local RAG over my own markdown notes with a tiny vector store.", status: "wip" },
  { name: "ng-signals-lab", desc: "Stress-testing Angular signals vs RxJS in a dashboard.", status: "done" },
  { name: "prompt-bench", desc: "Side-by-side prompt evaluation harness for OpenAI models.", status: "idea" },
];
