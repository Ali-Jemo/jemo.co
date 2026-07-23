import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "jemo labs — الفرع البحثي لشركة LXD",
    short_name: "jemo labs",
    description: "منظومة بحثية وتقنية تجمع الباحثين والمبدعين في بيئة عمل واحدة.",
    start_url: "/",
    display: "standalone",
    background_color: "#11100F",
    theme_color: "#B68A45",
    dir: "rtl",
    lang: "ar",
    icons: [
      {
        src: "/jemo-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/jemo-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
