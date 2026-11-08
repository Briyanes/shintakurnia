import { ArrowUpRight } from "lucide-react";
export function WhatsAppLink({
  phone,
  message,
  children = "Konsultasi WhatsApp",
  className = "text-link",
}: {
  phone: string;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={`https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ""}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}
