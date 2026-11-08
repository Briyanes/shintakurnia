import Link from "next/link";

export function Brand({
  label = "HAIR EDUCATOR",
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <Link
      className={`brand brand-artwork${compact ? " brand-compact" : ""}`}
      href="/"
      aria-label={`Shinta Kurnia — ${label}`}
    >
      <img
        className="brand-wordmark"
        src="/brand/shinta-kurnia-neutral.png"
        alt="Shinta Kurnia"
        width={1600}
        height={376}
      />
      <span aria-hidden="true">{label}</span>
    </Link>
  );
}
