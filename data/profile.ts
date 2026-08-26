export type Profile = {
  name: string;
  title: string;
  tagline: string;
  availability: string;
  location: string;
  focus: string[];
  about: string[];
  attributes: { label: string; value: string }[];
  socials: {
    github: string;
    telegram: string;
    linkedin: string;
    email: string;
    website: string;
  };
};

// SAMPLE DATA — replace with real personal data before publishing.
export const profile: Profile = {
  name: "Toewaioo",
  title: "Junior Developer",
  tagline: "Building modern digital systems with a focus on performance, reliability, scalability and clean architecture.",
  availability: "Available for selected projects",
  location: "Myanmar",
  focus: [
    "Backend Architecture",
    "Full-Stack Development",
    "API Engineering",
    "Database Design",
    "DevOps",
    "Automation",
  ],
  about: [
    "I build modern digital systems with a focus on performance, reliability, scalability and clean architecture.",
    "My work spans full-stack web applications, backend APIs, automation platforms, real-time systems and production infrastructure.",
  ],
  // Non-numeric attributes instead of unverified statistics.
  attributes: [
    { label: "ARCHITECTURE", value: "SCALABLE" },
    { label: "BACKEND", value: "HIGH PERFORMANCE" },
    { label: "DEPLOYMENT", value: "PRODUCTION READY" },
    { label: "CODE", value: "TYPE SAFE" },
  ],
  // PLACEHOLDERS — never invent URLs. Fill before publishing.
  socials: {
    github: "https://github.com/toewaioo",
    telegram: "https://t.me/toewaioo_dev",
    linkedin: "https://linkedin.com/in/toewaioo_dev",
    email: "toewaioo.dev@gmmail.com",
    website: "https://toewaioo.vercel.app",
  },
};
