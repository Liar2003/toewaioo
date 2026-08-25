export type ExperienceEntry = {
  year: string;
  role: string;
  description: string;
};

// SAMPLE STRUCTURE — replace with actual experience before publishing.
export const experience: ExperienceEntry[] = [
  {
    year: "2026",
    role: "Senior Full-Stack Engineer",
    description:
      "Designing scalable applications, APIs and production infrastructure.",
  },
  {
    year: "2025",
    role: "Full-Stack Engineer",
    description:
      "Building backend systems, automation platforms and modern web applications.",
  },
  {
    year: "2024",
    role: "Backend Engineer",
    description:
      "Focused on APIs, databases, background processing and system integration.",
  },
  {
    year: "2023",
    role: "Software Developer",
    description:
      "Developing web applications and backend services.",
  },
];

export type Principle = {
  title: string;
  statement: string;
};

export const principles: Principle[] = [
  {
    title: "Performance",
    statement: "Optimize bottlenecks, not assumptions.",
  },
  {
    title: "Scalability",
    statement: "Design systems that can grow without rewriting everything.",
  },
  {
    title: "Reliability",
    statement: "Expect failures and design for recovery.",
  },
  {
    title: "Security",
    statement: "Treat every input and integration boundary as untrusted.",
  },
  {
    title: "Maintainability",
    statement: "Prefer clear architecture over clever code.",
  },
  {
    title: "Observability",
    statement:
      "If a production system fails, the system should help explain why.",
  },
];
