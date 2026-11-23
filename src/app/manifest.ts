import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JEMO Labs — سجل الاكتشافات",
    short_name: "JEMO Labs",
    description: "سجل مفتوح لتوثيق وتدقيق أبحاث واكتشافات الذكاء الاصطناعي.",
    start_url: "/",
    display: "standalone",
    background_color: "#08090d",
    theme_color: "#08090d",
    dir: "rtl",
    lang: "ar",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
