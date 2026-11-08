import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/kursus-tata-rambut",
        destination: "/#program",
        permanent: true,
      },
      {
        source: "/kursus-tata-rambut/cutting",
        destination: "/#program",
        permanent: true,
      },
      {
        source: "/kursus-tata-rambut/blow-styling",
        destination: "/#program",
        permanent: true,
      },
      {
        source: "/galery-treatments-service",
        destination: "/#galeri",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self'; connect-src 'self' https://vercel.live; frame-src https://vercel.live; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};
export default config;
