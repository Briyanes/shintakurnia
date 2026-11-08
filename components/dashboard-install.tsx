"use client";
import { useEffect, useState } from "react";
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
export function DashboardInstall() {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null),
    [standalone, setStandalone] = useState(false),
    [ios, setIos] = useState(false),
    [notice, setNotice] = useState(""),
    [online, setOnline] = useState(true);
  useEffect(() => {
    const display = window.matchMedia("(display-mode: standalone)");
    const update = () =>
      setStandalone(
        display.matches ||
          Boolean(
            (navigator as Navigator & { standalone?: boolean }).standalone,
          ),
      );
    update();
    setIos(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    );
    setOnline(navigator.onLine);
    const connection = () => setOnline(navigator.onLine);
    const install = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallEvent);
    };
    const installed = () => {
      setPrompt(null);
      setStandalone(true);
    };
    display.addEventListener("change", update);
    window.addEventListener("beforeinstallprompt", install);
    window.addEventListener("appinstalled", installed);
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    if ("serviceWorker" in navigator)
      navigator.serviceWorker
        .register("/admin/sw.js", { scope: "/admin", updateViaCache: "none" })
        .catch(() =>
          setNotice(
            "Pemasangan offline belum tersedia. Dashboard tetap dapat dibuka saat online.",
          ),
        );
    return () => {
      display.removeEventListener("change", update);
      window.removeEventListener("beforeinstallprompt", install);
      window.removeEventListener("appinstalled", installed);
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
    };
  }, []);
  async function install() {
    if (!prompt) return;
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      setPrompt(null);
      setNotice(
        result.outcome === "accepted"
          ? "Ikuti proses pemasangan dari browser."
          : "Pemasangan dibatalkan. Anda tetap bisa memakai dashboard di browser.",
      );
    } catch {
      setNotice("Belum berhasil memasang. Gunakan menu pemasangan di browser.");
    }
  }
  return (
    <section className="dashboard-install" aria-label="Aplikasi dashboard">
      <div>
        <strong>
          {standalone ? "Dashboard Shinta" : "Dashboard di layar utama HP"}
        </strong>
        <p>
          {standalone
            ? "Edit harga dan program di aplikasi ini. Perubahan memerlukan internet."
            : "Pasang pintasan aplikasi untuk membuka dashboard langsung. Tetap perlu login; tidak perlu coding untuk mengelola kelas."}
        </p>
      </div>
      {!standalone && (
        <div>
          {prompt ? (
            <button
              type="button"
              className="button secondary"
              onClick={install}
            >
              Pasang dashboard
            </button>
          ) : (
            <details>
              <summary>Cara memasang</summary>
              <p>
                {ios
                  ? "Di Safari, ketuk Bagikan → Tambahkan ke Layar Utama (Add to Home Screen), lalu Tambah."
                  : "Di Chrome Android, buka menu browser → Instal aplikasi atau Tambahkan ke layar utama. Nama pilihan dapat berbeda menurut browser/perangkat."}
              </p>
            </details>
          )}
        </div>
      )}
      {(!online || notice) && (
        <p role="status" className="install-status">
          {!online
            ? "Anda sedang offline. Jangan tutup halaman yang memiliki perubahan belum tersimpan. Sambungkan internet sebelum menyimpan."
            : notice}
        </p>
      )}
    </section>
  );
}
