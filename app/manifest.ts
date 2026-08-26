import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Toewaioo",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#030508",
    theme_color: "#030508",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
