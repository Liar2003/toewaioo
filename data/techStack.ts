export type TechCategory = {
  id: string;
  name: string;
  items: string[];
};

// SAMPLE DATA — adjust to actual proficiency before publishing.
export const techCategories: TechCategory[] = [
  {
    id: "backend",
    name: "BACKEND",
    items: ["PHP", "Laravel", "Go", "REST API", "WebSocket", "Queues", "Authentication", "Microservices"],
  },
  {
    id: "frontend",
    name: "FRONTEND",
    items: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    id: "databases",
    name: "DATABASES",
    items: ["PostgreSQL", "MySQL", "Redis"],
  },
  {
    id: "infrastructure",
    name: "INFRASTRUCTURE",
    items: ["Linux", "Docker", "Nginx", "Git", "CI/CD", "VPS", "Cloud Infrastructure"],
  },
  {
    id: "architecture",
    name: "ARCHITECTURE",
    items: ["API Design", "Caching", "Queue Processing", "Database Optimization", "Service Architecture", "Observability", "Security", "Scalability"],
  },
];
