import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shinta Kurnia — Private Hair Education",
    short_name: "Shinta Kurnia",
    lang: "id",
    description: "Kelas privat rambut 1-on-1 bersama Shinta Kurnia.",
    start_url: "/",
    display: "browser",
    background_color: "#f8f7f3",
    theme_color: "#242c28",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
