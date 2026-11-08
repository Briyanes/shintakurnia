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
        src="/brand/header-educator.png"
        alt="Shinta Kurnia — Hair Educator"
        width={777}
        height={155}
      />
    </Link>
  );
}
