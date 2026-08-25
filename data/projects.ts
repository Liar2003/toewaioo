export type Project = {
  id: string;
  codeName: string;
  name: string;
  category: string;
  description: string;
  technologies: string[];
  status: string;
  featured: boolean;
  highlights?: string[];
  architecture?: string[];
  features?: string[];
  github?: string;
  demo?: string;
};

// SAMPLE PROJECTS — replace with actual projects before publishing.
export const projects: Project[] = [
  {
    id: "media-processing-platform",
    codeName: "PROJECT_01",
    name: "Media Processing Platform",
    category: "Distributed Backend System",
    description:
      "A scalable media processing platform designed for high-concurrency URL processing, asynchronous jobs, queue-based workers and reliable result delivery.",
    technologies: ["Laravel", "Go", "PostgreSQL", "Redis", "Docker", "Nginx", "REST API", "Queue Workers"],
    status: "Production",
    featured: true,
    architecture: [
      "Client",
      "API Gateway",
      "Application API",
      "Redis Queue",
      "Worker Pool",
      "Media Processing",
      "Storage / Delivery",
    ],
    highlights: [
      "Asynchronous processing",
      "Queue architecture",
      "Worker scaling",
      "Retry strategy",
      "Rate limiting",
      "Caching",
      "Database indexing",
      "API design",
      "Failure handling",
    ],
  },
  {
    id: "telegram-automation-platform",
    codeName: "PROJECT_02",
    name: "Telegram Automation Platform",
    category: "Automation / Bot Platform",
    description:
      "A feature-rich Telegram automation platform with command routing, content processing, subscription logic, channel management and asynchronous background jobs.",
    technologies: ["PHP", "Laravel", "Telegram Bot API", "PostgreSQL", "Redis", "Docker"],
    status: "Production",
    featured: true,
    features: [
      "Command Routing",
      "Subscription Management",
      "Required Channel Verification",
      "Background Jobs",
      "Content Processing",
      "Rate Limiting",
      "Admin Controls",
      "API Integrations",
    ],
  },
  {
    id: "developer-infrastructure",
    codeName: "PROJECT_03",
    name: "Production Developer Infrastructure",
    category: "DevOps / Infrastructure",
    description:
      "Containerized infrastructure designed for reliable deployment, service isolation, reverse proxy routing, automated deployment and production operations.",
    technologies: ["Linux", "Docker", "Nginx", "Git", "CI/CD", "PostgreSQL", "Redis", "VPS"],
    status: "Production",
    featured: true,
    features: [
      "Containerization",
      "Reverse Proxy",
      "TLS",
      "Service Isolation",
      "Deployment Automation",
      "Backups",
      "Logging",
      "Monitoring",
      "Resource Management",
    ],
  },
];
