"use client";
import { useState } from "react";
import type { Program } from "@/lib/schema";
import { statusLabels } from "@/lib/dashboard-ui";
import { Field, ImageField } from "./dashboard";
import { ChevronRight, ArrowLeft, ImagePlus } from "lucide-react";
export function ProgramEditor({
  programs,
  onChange,
  onAdd,
  onError,
}: {
  programs: Program[];
  onChange: (index: number, patch: Partial<Program>) => void;
  onAdd: () => string;
  onError: (message: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null),
    [step, setStep] = useState("Info kelas"),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all");
  const index = programs.findIndex((p) => p.id === selected),
    p = programs[index];
  if (!p)
    return (
      <section className="program-manager">
        <div className="manager-toolbar">
          <div>
            <h2>Semua program</h2>
            <p>Atur materi, biaya, dan status kelas.</p>
          </div>
          <button
            className="button"
            onClick={() => {
              setSelected(onAdd());
              setStep("Info kelas");
            }}
          >
            + Tambah program
          </button>
        </div>
        <div className="program-filters">
          <label>
            Cari program
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nama atau kategori"
            />
          </label>
          <label>
            Status
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Semua status</option>
              <option value="published">Terbit</option>
              <option value="draft">Draft</option>
              <option value="archived">Arsip</option>
            </select>
          </label>
        </div>
        <div className="admin-program-list">
          {programs
            .filter(
              (p) =>
                (filter === "all" || p.status === filter) &&
                `${p.title} ${p.category}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
            )
            .map((p) => (
              <button
                className="admin-program-row"
                key={p.id}
                onClick={() => {
                  setSelected(p.id);
                  setStep("Info kelas");
                }}
              >
                {p.image ? (
                  <img src={p.image} alt="" />
                ) : (
                  <span className="program-photo-empty">
                    <ImagePlus size={22} />
                  </span>
                )}
                <span className="program-row-copy">
                  <span className="program-row-meta">
                    {p.category} · {p.duration}
                  </span>
                  <strong>{p.title}</strong>
                  <span>
                    {p.price === null
                      ? "Harga konsultasi"
                      : `Rp${p.price.toLocaleString("id-ID")}`}
                  </span>
                </span>
                <span className={`state-tag state-${p.status}`}>
                  {statusLabels[p.status]}
                </span>
                <ChevronRight size={18} />
              </button>
            ))}
        </div>
        {!programs.some(
          (p) =>
            (filter === "all" || p.status === filter) &&
            `${p.title} ${p.category}`
              .toLowerCase()
              .includes(search.toLowerCase()),
        ) && (
          <div className="admin-empty">
            <h3>Tidak ada program yang cocok.</h3>
            <p>Ubah pencarian atau tambahkan program baru.</p>
          </div>
        )}
      </section>
    );
  const update = (patch: Partial<Program>) => onChange(index, patch);
  return (
    <section className="program-edit">
      <button
        className="text-button editor-back"
        onClick={() => setSelected(null)}
      >
        <ArrowLeft size={16} /> Semua program
      </button>
      <div className="editor-heading">
        <div>
          <span className="eyebrow">EDIT PROGRAM</span>
          <h2>{p.title}</h2>
        </div>
        <span className={`state-tag state-${p.status}`}>
          {statusLabels[p.status]}
        </span>
      </div>
      <nav className="editor-step-nav" aria-label="Bagian editor program">
        {["Info kelas", "Materi", "Harga", "Foto"].map((t) => (
          <button
            key={t}
            aria-current={step === t ? "step" : undefined}
            onClick={() => setStep(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      <div className="editor-panel editor-fields">
        {step === "Info kelas" && (
          <>
            <h3>Informasi kelas</h3>
            <Field
              label="Nama program"
              value={p.title}
              onChange={(title) => update({ title })}
            />
            <div className="two-col">
              <Field
                label="Kategori"
                value={p.category}
                onChange={(category) => update({ category })}
              />
              <Field
                label="Level"
                value={p.level}
                onChange={(level) => update({ level })}
              />
              <Field
                label="Durasi"
                value={p.duration}
                onChange={(duration) => update({ duration })}
              />
              <label>
                Format
                <select
                  value={p.format}
                  onChange={(e) =>
                    update({ format: e.target.value as Program["format"] })
                  }
                >
                  <option value="offline">Tatap muka</option>
                  <option value="online">
                    Online — aktifkan hanya jika siap
                  </option>
                </select>
              </label>
            </div>
            <Field
              label="Deskripsi"
              value={p.description}
              multiline
              onChange={(description) => update({ description })}
            />
            <Field
              label="Lokasi"
              value={p.location}
              onChange={(location) => update({ location })}
            />
            <details className="advanced-fields">
              <summary>Pengaturan tautan</summary>
              <Field
                label="Slug URL (huruf kecil & tanda hubung)"
                value={p.slug}
                onChange={(slug) => update({ slug })}
              />
              <small>
                Mengubah slug program yang sudah terbit memerlukan redirect URL
                lama.
              </small>
            </details>
          </>
        )}
        {step === "Materi" && (
          <>
            <h3>Apa yang dipelajari?</h3>
            <Field
              label="Tujuan belajar (satu per baris)"
              value={p.outcomes.join("\n")}
              multiline
              onChange={(v) => update({ outcomes: v.split("\n") })}
            />
            <Field
              label="Materi (satu per baris)"
              value={p.materials.join("\n")}
              multiline
              onChange={(v) => update({ materials: v ? v.split("\n") : [] })}
            />
            <Field
              label="Fasilitas & ketentuan"
              value={p.facilities}
              multiline
              onChange={(facilities) => update({ facilities })}
            />
          </>
        )}
        {step === "Harga" && (
          <>
            <h3>Biaya & publikasi</h3>
            <label>
              Harga rupiah (kosong = konsultasi)
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={1000000000}
                value={p.price ?? ""}
                onChange={(e) =>
                  update({
                    price:
                      e.target.value === "" ? null : Number(e.target.value),
                  })
                }
              />
            </label>
            <Field
              label="Catatan harga"
              value={p.priceNote}
              multiline
              onChange={(priceNote) => update({ priceNote })}
            />
            <label>
              Status program
              <select
                value={p.status}
                onChange={(e) =>
                  update({ status: e.target.value as Program["status"] })
                }
              >
                <option value="draft">Draft — belum tampil</option>
                <option value="published">
                  Terbit — tampil setelah disimpan
                </option>
                <option value="archived">Arsip — tidak tampil</option>
              </select>
            </label>
            <p className="field-note">
              Periksa data di Preview. Perubahan baru diterbitkan setelah
              menekan Simpan perubahan.
            </p>
          </>
        )}
        {step === "Foto" && (
          <>
            <h3>Foto program</h3>
            <ImageField
              label="Unggah foto"
              value={p.image}
              onChange={(image) => update({ image })}
              onError={onError}
            />
            <p className="field-note">
              Gunakan foto yang memiliki izin publikasi. Menghapus foto dari
              konten tidak menghapus file penyimpanannya.
            </p>
          </>
        )}
      </div>
      <div className="editor-step-actions">
        {step !== "Info kelas" && (
          <button
            className="button secondary"
            onClick={() =>
              setStep(
                ["Info kelas", "Materi", "Harga", "Foto"][
                  ["Info kelas", "Materi", "Harga", "Foto"].indexOf(step) - 1
                ],
              )
            }
          >
            Sebelumnya
          </button>
        )}
        {step !== "Foto" && (
          <button
            className="button"
            onClick={() =>
              setStep(
                ["Info kelas", "Materi", "Harga", "Foto"][
                  ["Info kelas", "Materi", "Harga", "Foto"].indexOf(step) + 1
                ],
              )
            }
          >
            Lanjut <ChevronRight size={16} />
          </button>
        )}
      </div>
    </section>
  );
}
