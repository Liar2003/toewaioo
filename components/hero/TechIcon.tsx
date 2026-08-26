import type { ComponentType } from "react";
import SiDocker from "@icons-pack/react-simple-icons/icons/SiDocker";
import SiGit from "@icons-pack/react-simple-icons/icons/SiGit";
import SiGithubactions from "@icons-pack/react-simple-icons/icons/SiGithubactions";
import SiGo from "@icons-pack/react-simple-icons/icons/SiGo";
import SiJavascript from "@icons-pack/react-simple-icons/icons/SiJavascript";
import SiLaravel from "@icons-pack/react-simple-icons/icons/SiLaravel";
import SiLinux from "@icons-pack/react-simple-icons/icons/SiLinux";
import SiNextdotjs from "@icons-pack/react-simple-icons/icons/SiNextdotjs";
import SiNginx from "@icons-pack/react-simple-icons/icons/SiNginx";
import SiPhp from "@icons-pack/react-simple-icons/icons/SiPhp";
import SiPostgresql from "@icons-pack/react-simple-icons/icons/SiPostgresql";
import SiReact from "@icons-pack/react-simple-icons/icons/SiReact";
import SiRedis from "@icons-pack/react-simple-icons/icons/SiRedis";
import SiTypescript from "@icons-pack/react-simple-icons/icons/SiTypescript";
import { Braces, Zap } from "lucide-react";

type IconComponent = ComponentType<{
  size?: number | string;
  color?: string;
  title?: string;
}>;

const ICONS: Record<string, IconComponent> = {
  php: SiPhp,
  laravel: SiLaravel,
  go: SiGo,
  javascript: SiJavascript,
  typescript: SiTypescript,
  react: SiReact,
  nextjs: SiNextdotjs,
  postgresql: SiPostgresql,
  redis: SiRedis,
  docker: SiDocker,
  linux: SiLinux,
  nginx: SiNginx,
  restapi: Braces as IconComponent,
  websocket: Zap as IconComponent,
  git: SiGit,
  cicd: SiGithubactions,
};

type Props = {
  id: string;
  size?: number;
  color?: string;
};

/** Brand icon for a technology node id — no text, just the mark. */
export default function TechIcon({ id, size = 20, color }: Props) {
  const Icon = ICONS[id];
  if (!Icon) return null;
  return <Icon size={size} color={color} aria-hidden="true" />;
}
