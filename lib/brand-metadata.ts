import type { Metadata } from "next";

export function brandMetadata(
  env: Record<string, string | undefined>,
): Metadata & { metadataBase: URL } {
  // Use this exact deployment in preview, not an unrelated production/custom hostname.
  const origin =
    env.VERCEL_ENV === "production" && env.NEXT_PUBLIC_SITE_URL
      ? env.NEXT_PUBLIC_SITE_URL
      : env.VERCEL_URL
        ? `https://${env.VERCEL_URL}`
        : "http://localhost:3000";
  return {
    metadataBase: new URL(origin),
    applicationName: "Shinta Kurnia",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        {
          url: "/brand/sk-transparent-32.png",
          type: "image/png",
          sizes: "32x32",
        },
        {
          url: "/brand/sk-transparent-32.png",
          type: "image/png",
          sizes: "32x32",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/brand/sk-light-32.png",
          type: "image/png",
          sizes: "32x32",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      apple: [
        { url: "/brand/icon-180.png", sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      title: "Shinta Kurnia — Private Hair Education",
      description:
        "Kelas rambut privat 1-on-1. Cutting, colouring, dan styling bersama Shinta Kurnia.",
      siteName: "Shinta Kurnia",
      locale: "id_ID",
      type: "website",
      images: [
        {
          url: "/brand/social-card.png",
          width: 1200,
          height: 630,
          alt: "Shinta Kurnia — Private Hair Education, kelas privat 1-on-1",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Shinta Kurnia — Private Hair Education",
      description: "Cutting, colouring, dan styling — kelas privat 1-on-1.",
      images: ["/brand/social-card.png"],
    },
  };
}
