export type ExperienceEntry = {
  year: string;
  role: string;
  company?: string;
  description: string;
  highlights?: string[];
  technologies?: string[];
  type: "work" | "project" | "learning";
};

// SAMPLE STRUCTURE — replace with actual experience before publishing.
export const experience: ExperienceEntry[] = [
  {
    year: "2026",
    role: "Senior Full-Stack Engineer",
    company: "Independent / Freelance",
    description:
      "Designing scalable applications, APIs and production infrastructure. Leading architecture decisions for multi-service platforms serving thousands of concurrent users.",
    highlights: [
      "Architected microservices platform with Go + Node.js",
      "Reduced deployment time by 80% with automated CI/CD",
      "Implemented real-time collaboration with WebSocket",
      "Built e-commerce platform handling 5k+ RPS",
    ],
    technologies: ["Go", "Node.js", "React", "Next.js", "Docker", "Kubernetes"],
    type: "work",
  },
  {
    year: "2025",
    role: "Full-Stack Engineer",
    company: "Media Processing Platform",
    description:
      "Building backend systems, automation platforms and modern web applications. Designed queue-based worker architecture processing 12k+ jobs per hour.",
    highlights: [
      "Built Laravel Horizon queue system with Go workers",
      "Implemented Redis caching reducing DB load by 70%",
      "Designed RESTful API with OpenAPI specs",
      "Set up Docker Swarm for horizontal scaling",
    ],
    technologies: ["Laravel", "Go", "PostgreSQL", "Redis", "Docker"],
    type: "work",
  },
  {
    year: "2025",
    role: "DevOps Automation Toolkit",
    description:
      "Created open-source CLI toolkit for automating DevOps workflows across multiple cloud providers. Gained 1.2k+ GitHub stars and 5k+ monthly downloads.",
    highlights: [
      "Built in Go with Cobra CLI framework",
      "Multi-cloud support: AWS, GCP, DigitalOcean",
      "Plugin architecture with WASM support",
      "Published to Homebrew, AUR, Scoop",
    ],
    technologies: ["Go", "Cobra", "Terraform", "AWS SDK", "GCP SDK"],
    type: "project",
  },
  {
    year: "2024",
    role: "Backend Engineer",
    company: "Telegram Automation Platform",
    description:
      "Focused on APIs, databases, background processing and system integration. Built bot serving 52k+ active users with 99.9% message delivery rate.",
    highlights: [
      "Built command router with middleware pipeline",
      "Implemented subscription logic with Stripe integration",
      "Designed idempotent message processing",
      "Achieved < 180ms response time",
    ],
    technologies: ["PHP", "Laravel", "Telegram API", "PostgreSQL", "Redis"],
    type: "work",
  },
  {
    year: "2024",
    role: "Production Infrastructure",
    description:
      "Designed containerized infrastructure for reliable deployment. Managing 15+ services across multiple environments with zero-downtime deployments.",
    highlights: [
      "Docker Compose multi-service orchestration",
      "Nginx reverse proxy with SSL termination",
      "Prometheus + Grafana monitoring stack",
      "Automated backups with S3 storage",
    ],
    technologies: ["Linux", "Docker", "Nginx", "Prometheus", "Grafana"],
    type: "project",
  },
  {
    year: "2023",
    role: "Software Developer",
    description:
      "Developing web applications and backend services. Learning modern development practices and building foundational skills in full-stack development.",
    highlights: [
      "Built first production web applications",
      "Learned Git workflow and CI/CD basics",
      "Introduced to Docker and containerization",
      "Started exploring cloud infrastructure",
    ],
    technologies: ["PHP", "JavaScript", "MySQL", "Git", "Docker"],
    type: "learning",
  },
];

export type Principle = {
  title: string;
  statement: string;
  icon: string;
};

export const principles: Principle[] = [
  {
    title: "Performance",
    statement: "Optimize bottlenecks, not assumptions. Profile before you optimize.",
    icon: "⚡",
  },
  {
    title: "Scalability",
    statement: "Design systems that can grow without rewriting everything.",
    icon: "📈",
  },
  {
    title: "Reliability",
    statement: "Expect failures and design for recovery. Every system will fail.",
    icon: "🛡️",
  },
  {
    title: "Security",
    statement: "Treat every input and integration boundary as untrusted.",
    icon: "🔒",
  },
  {
    title: "Maintainability",
    statement: "Prefer clear architecture over clever code. Future you will thank you.",
    icon: "🔧",
  },
  {
    title: "Observability",
    statement: "If a production system fails, the system should help explain why.",
    icon: "👁️",
  },
];
