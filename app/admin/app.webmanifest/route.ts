import { NextResponse } from "next/server";
export function GET() {
  return new NextResponse(
    JSON.stringify({
      id: "/admin",
      name: "Shinta — Dashboard Kelas",
      short_name: "Shinta Admin",
      description: "Kelola harga, program dan konten kelas Shinta Kurnia.",
      lang: "id",
      start_url: "/admin",
      scope: "/admin",
      display: "standalone",
      background_color: "#f6f5f0",
      theme_color: "#252725",
      icons: [
        {
          src: "/app-icons/sk-admin-v2-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/app-icons/sk-admin-v2-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    }),
    {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "no-cache",
      },
    },
  );
}
