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
// Owner requested public display of these uploads. Keep illustration captions;
// publication approval is not confirmation of copyright or model-release rights.
export function programIllustration(id: string): Illustration | undefined {
  return Object.hasOwn(illustrations, id) ? illustrations[id] : undefined;
}
export const profilePhoto = "/photos/shinta.webp";
