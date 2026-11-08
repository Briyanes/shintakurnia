import type { Metadata } from "next";
import { DashboardInstall } from "@/components/dashboard-install";
export const metadata: Metadata = {
  manifest: "/admin/app.webmanifest",
  applicationName: "Shinta Admin",
  appleWebApp: {
    capable: true,
    title: "Shinta Admin",
    statusBarStyle: "default",
  },
  robots: { index: false, follow: false },
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-app">
      <DashboardInstall />
      {children}
    </div>
  );
}
