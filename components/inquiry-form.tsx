"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import type { Program } from "@/lib/schema";
export default function InquiryForm({
  programs,
  selected,
  whatsapp,
}: {
  programs: Program[];
  selected: string;
  whatsapp: string;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [reference, setReference] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data),
          consent: data.get("consent") === "on",
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setReference(result.id || "diterima");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengirim.");
    } finally {
      setBusy(false);
    }
  }
  if (reference)
    return (
      <div className="success-panel" role="status">
        <span className="eyebrow">PERMINTAAN DITERIMA</span>
        <h2>
          Permintaan konsultasi
          <br />
          <em>sudah tercatat.</em>
        </h2>
        <p>
          Permintaan konsultasi berhasil disimpan. Ini belum merupakan
          konfirmasi jadwal atau pendaftaran.
        </p>
        <a
          className="button"
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo Shinta, saya telah mengirim formulir konsultasi. Referensi: ${reference}. Saya ingin melanjutkan konsultasi kelas.`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Lanjutkan lewat WhatsApp ↗
        </a>
      </div>
    );
  return (
    <form className="inquiry-form" onSubmit={submit}>
      <div className="two-col">
        <label>
          Nama lengkap
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
          />
        </label>
        <label>
          Nomor WhatsApp
          <input
            name="phone"
            required
            type="tel"
            maxLength={22}
            autoComplete="tel"
            placeholder="08…"
          />
        </label>
      </div>
      <label>
        Program yang diminati
        <select name="program" defaultValue={selected}>
          <option value="konsultasi">Bantu saya memilih program</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </label>
      <div className="two-col">
        <label>
          Kota / lokasi yang diinginkan
          <input
            name="city"
            required
            maxLength={200}
            placeholder="Contoh: Surabaya"
          />
        </label>
        <label>
          Preferensi waktu (opsional)
          <input
            name="date"
            maxLength={100}
            placeholder="Contoh: akhir November"
          />
        </label>
      </div>
      <label>
        Pengalamanmu
        <select name="experience">
          <option>Pemula</option>
          <option>Sudah berpengalaman</option>
        </select>
      </label>
      <label>
        Apa yang ingin kamu pelajari?
        <textarea
          name="goal"
          required
          minLength={10}
          maxLength={1500}
          rows={4}
          placeholder="Ceritakan tujuan atau teknik yang ingin kamu kuasai…"
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="checkbox">
        <input type="checkbox" name="consent" required />
        <span>
          Saya menyetujui penggunaan data untuk konsultasi dan telah membaca{" "}
          <a href="/privasi" target="_blank" rel="noopener noreferrer">
            pemberitahuan privasi
          </a>
          .
        </span>
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <button className="button" disabled={busy}>
        {busy ? "Mengirim…" : "Kirim permintaan konsultasi ↗"}
      </button>
      <small>
        Jangan sertakan informasi pembayaran atau data sensitif lainnya.
      </small>
    </form>
  );
}
