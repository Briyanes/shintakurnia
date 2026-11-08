import type { Illustration } from "@/lib/photo-assets";
export function ProgramPhoto({
  photo,
  priority = false,
}: {
  photo: Illustration;
  priority?: boolean;
}) {
  return (
    <figure className="illustration-photo">
      <img
        src={photo.src}
        alt={photo.alt}
        width={1000}
        height={667}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}
