export type Illustration = { src: string; alt: string; caption: string };
const caption = "Foto ilustrasi, bukan dokumentasi kelas Shinta.";
const illustrations: Record<string, Illustration> = {
  "basic-cutting": {
    src: "/photos/cutting.webp",
    alt: "Ilustrasi proses memotong rambut dengan gunting",
    caption,
  },
  "intermediate-haircut": {
    src: "/photos/cutting.webp",
    alt: "Ilustrasi detail teknik pemotongan rambut",
    caption,
  },
  colouring: {
    src: "/photos/colouring.webp",
    alt: "Ilustrasi proses pewarnaan rambut",
    caption,
  },
  "basic-blow": {
    src: "/photos/blow.webp",
    alt: "Ilustrasi pengeringan rambut dengan hair dryer dan sikat",
    caption,
  },
  "styling-iron": {
    src: "/photos/styling.webp",
    alt: "Ilustrasi penataan rambut menggunakan styling iron",
    caption,
  },
};
// Licensing of uploaded process photographs is pending. Never enable on production
// without a separate rights review. This gate applies to rendered illustration use.
export function programIllustration(
  id: string,
  environment = process.env.VERCEL_ENV,
): Illustration | undefined {
  return environment === "preview" || environment === "development"
    ? illustrations[id]
    : undefined;
}
export const profilePhoto = "/photos/shinta.webp";
