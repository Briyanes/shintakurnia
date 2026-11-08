"use client";
import { useState } from "react";
import type { Content, Program } from "@/lib/schema";
import { ProgramCard } from "./site";
type Row = {
  id: string;
  name: string;
  phone: string;
  city: string;
  date: string;
  goal: string;
  experience: string;
  status: string;
  createdAt: string;
  programTitle: string;
  quotedPrice: number | null;
  etag: string;
};
async function request(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Permintaan gagal.");
  return data;
}
export function Login() {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <main className="admin-setup">
      <a className="brand" href="/">
        shinta kurnia<span>PRIVATE DASHBOARD</span>
      </a>
      <span className="eyebrow">WELCOME BACK</span>
      <h1>
        Ruang untuk
        <br />
        <em>mengembangkan kelasmu.</em>
      </h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const password = new FormData(e.currentTarget).get("password");
          setBusy(true);
          setError("");
          try {
            await request("/api/admin/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password }),
            });
            location.reload();
          } catch (e) {
            setError((e as Error).message);
            setBusy(false);
          }
        }}
      >
        <label>
          Password admin
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={256}
          />
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="button" disabled={busy}>
          {busy ? "Memeriksa…" : "Masuk dashboard ↗"}
        </button>
      </form>
    </main>
  );
}
function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label>
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
function ImageField({
  label,
  value,
  onChange,
  onError,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onError: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="image-field">
      <label>
        {label}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 4000000) {
              onError("Maksimal 4 MB per gambar.");
              return;
            }
            setBusy(true);
            const body = new FormData();
            body.set("file", file);
            try {
              const result = await request("/api/admin/media", {
                method: "POST",
                body,
              });
              onChange(result.url);
            } catch (e) {
              onError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      {busy && <p role="status">Mengunggah…</p>}
      {value && (
        <>
          <img src={value} alt="Pratinjau gambar" />
          <button className="text-button" onClick={() => onChange("")}>
            Lepas gambar dari konten
          </button>
        </>
      )}
      <small>
        JPG, PNG, WebP · Maksimal 4 MB. Gunakan foto yang Anda miliki izinnya.
      </small>
    </div>
  );
}
export default function Dashboard({
  initial,
  initialEtag,
}: {
  initial: Content;
  initialEtag: string | null;
}) {
  const [data, setData] = useState(initial),
    [etag, setEtag] = useState(initialEtag),
    [tab, setTab] = useState("Ringkasan"),
    [dirty, setDirty] = useState(false),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [rows, setRows] = useState<Row[]>([]),
    [cursor, setCursor] = useState<string | null>(null),
    [loaded, setLoaded] = useState(false);
  function change(next: Content) {
    setData(next);
    setDirty(true);
    setMessage("");
  }
  function program(index: number, patch: Partial<Program>) {
    change({
      ...data,
      programs: data.programs.map((p, i) =>
        i === index ? { ...p, ...patch } : p,
      ),
    });
  }
  async function save() {
    setBusy(true);
    setMessage("");
    try {
      const result = await request("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, etag }),
      });
      setEtag(result.etag);
      setDirty(false);
      setMessage(
        "Tersimpan. Program berstatus Terbit sudah tampil di website.",
      );
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function loadInquiries(more = false) {
    setBusy(true);
    try {
      const result = await request(
        "/api/admin/inquiries" +
          (more && cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""),
      );
      setRows(more ? [...rows, ...result.rows] : result.rows);
      setCursor(result.cursor);
      setLoaded(true);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const tabs = [
    "Ringkasan",
    "Program",
    "Profil",
    "Galeri",
    "Testimoni",
    "FAQ",
    "Inquiry",
    "Preview",
  ];
  return (
    <div className="dashboard">
      <aside className="admin-sidebar">
        <a className="brand" href="/">
          shinta kurnia<span>YOUR CREATIVE SPACE</span>
        </a>
        <nav aria-label="Dashboard">
          {tabs.map((t) => (
            <button
              key={t}
              className={tab === t ? "selected" : ""}
              onClick={() => {
                setTab(t);
                if (t === "Inquiry" && !loaded) void loadInquiries();
              }}
            >
              {t}
            </button>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noopener noreferrer">
          Buka website ↗
        </a>
        <button
          className="text-button"
          onClick={async () => {
            if (dirty && !confirm("Keluar tanpa menyimpan perubahan?")) return;
            try {
              await request("/api/admin/logout", { method: "POST" });
              location.reload();
            } catch (e) {
              setMessage((e as Error).message);
            }
          }}
        >
          Keluar
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-top">
          <div>
            <span className="eyebrow">DASHBOARD / {tab.toUpperCase()}</span>
            <h1>{tab === "Ringkasan" ? "Halo, Shinta." : tab}</h1>
          </div>
          <button className="button" disabled={busy || !dirty} onClick={save}>
            {busy
              ? "Memproses…"
              : dirty
                ? "Simpan perubahan"
                : "Semua tersimpan ✓"}
          </button>
        </div>
        <p className="muted">
          {dirty
            ? "Ada perubahan belum tersimpan. Periksa tab Preview sebelum menyimpan."
            : "Kelola program dan kontenmu di satu tempat."}
        </p>
        {message && (
          <p role="status" className="notice">
            {message}
          </p>
        )}
        {tab === "Ringkasan" && (
          <>
            <div className="stats">
              <article>
                <span>Program terbit</span>
                <strong>
                  {data.programs.filter((p) => p.status === "published").length}
                </strong>
              </article>
              <article>
                <span>Draft</span>
                <strong>
                  {data.programs.filter((p) => p.status === "draft").length}
                </strong>
              </article>
              <article>
                <span>Format kelas</span>
                <strong>1:1</strong>
              </article>
            </div>
            <section className="editor-panel">
              <h2>Mulai dari yang paling penting.</h2>
              <p>
                Periksa harga hasil migrasi, ketentuan lokasi, durasi,
                fasilitas, serta data profil sebelum peluncuran. Tambahkan foto
                asli dan testimoni hanya dengan izin.
              </p>
              <p>
                Perubahan disimpan dengan pemeriksaan versi. Jika sesi lain
                mengubah konten, muat ulang agar perubahan tidak tertimpa.
                Salinan sebelum perubahan tersimpan sebagai backup privat.
              </p>
              <p>
                Inquiry bukan booking terkonfirmasi. Tinjau dan konfirmasi total
                biaya secara langsung.
              </p>
              <button className="button" onClick={() => setTab("Program")}>
                Kelola program ↗
              </button>
            </section>
          </>
        )}
        {tab === "Program" && (
          <>
            <button
              className="button secondary"
              onClick={() => {
                const id = `kelas-${crypto.randomUUID().slice(0, 8)}`;
                change({
                  ...data,
                  programs: [
                    ...data.programs,
                    {
                      id,
                      slug: id,
                      title: "Program baru",
                      category: "Cutting",
                      level: "Pemula",
                      description: "Tulis deskripsi program.",
                      duration: "Dikonfirmasi",
                      price: null,
                      priceNote: "Harga dikonfirmasi saat konsultasi.",
                      outcomes: ["Tulis tujuan belajar"],
                      materials: [],
                      facilities: "",
                      location: "Berdasarkan kesepakatan",
                      format: "offline",
                      status: "draft",
                      image: "",
                    },
                  ],
                });
              }}
            >
              + Tambah program
            </button>
            {data.programs.map((p, i) => (
              <details className="editor-panel" key={p.id}>
                <summary>
                  {p.title}
                  <span className="badge">{p.status}</span>
                </summary>
                <div className="editor-fields">
                  <div className="two-col">
                    <Field
                      label="Nama program"
                      value={p.title}
                      onChange={(v) => program(i, { title: v })}
                    />
                    <Field
                      label="Slug URL (huruf kecil & tanda hubung)"
                      value={p.slug}
                      onChange={(v) => program(i, { slug: v })}
                    />
                    <Field
                      label="Kategori"
                      value={p.category}
                      onChange={(v) => program(i, { category: v })}
                    />
                    <Field
                      label="Level"
                      value={p.level}
                      onChange={(v) => program(i, { level: v })}
                    />
                    <Field
                      label="Durasi"
                      value={p.duration}
                      onChange={(v) => program(i, { duration: v })}
                    />
                    <label>
                      Harga rupiah (kosong = konsultasi)
                      <input
                        type="number"
                        min={0}
                        max={1000000000}
                        value={p.price ?? ""}
                        onChange={(e) =>
                          program(i, {
                            price:
                              e.target.value === ""
                                ? null
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Status
                      <select
                        value={p.status}
                        onChange={(e) =>
                          program(i, {
                            status: e.target.value as Program["status"],
                          })
                        }
                      >
                        <option value="draft">Draft — belum tampil</option>
                        <option value="published">Terbit</option>
                        <option value="archived">Arsip</option>
                      </select>
                    </label>
                    <label>
                      Format
                      <select
                        value={p.format}
                        onChange={(e) =>
                          program(i, {
                            format: e.target.value as Program["format"],
                          })
                        }
                      >
                        <option value="offline">Tatap muka</option>
                        <option value="online">
                          Online (aktifkan hanya jika siap)
                        </option>
                      </select>
                    </label>
                  </div>
                  <Field
                    label="Deskripsi"
                    value={p.description}
                    multiline
                    onChange={(v) => program(i, { description: v })}
                  />
                  <Field
                    label="Catatan harga"
                    value={p.priceNote}
                    onChange={(v) => program(i, { priceNote: v })}
                  />
                  <Field
                    label="Tujuan belajar (satu per baris)"
                    value={p.outcomes.join("\n")}
                    multiline
                    onChange={(v) => program(i, { outcomes: v.split("\n") })}
                  />
                  <Field
                    label="Materi (satu per baris)"
                    value={p.materials.join("\n")}
                    multiline
                    onChange={(v) =>
                      program(i, { materials: v ? v.split("\n") : [] })
                    }
                  />
                  <Field
                    label="Fasilitas & ketentuan"
                    value={p.facilities}
                    multiline
                    onChange={(v) => program(i, { facilities: v })}
                  />
                  <Field
                    label="Lokasi"
                    value={p.location}
                    onChange={(v) => program(i, { location: v })}
                  />
                  <ImageField
                    label="Foto program"
                    value={p.image}
                    onChange={(v) => program(i, { image: v })}
                    onError={setMessage}
                  />
                  <small>
                    Perubahan slug pada program yang sudah diluncurkan
                    memerlukan redirect URL lama.
                  </small>
                </div>
              </details>
            ))}
          </>
        )}
        {tab === "Profil" && (
          <section className="editor-panel editor-fields">
            <Field
              label="Nama"
              value={data.name}
              onChange={(v) => change({ ...data, name: v })}
            />
            <Field
              label="Headline (baris kedua ditampilkan miring)"
              value={data.headline}
              multiline
              onChange={(v) => change({ ...data, headline: v })}
            />
            <Field
              label="Pengantar beranda"
              value={data.intro}
              multiline
              onChange={(v) => change({ ...data, intro: v })}
            />
            <Field
              label="Biografi"
              value={data.bio}
              multiline
              onChange={(v) => change({ ...data, bio: v })}
            />
            <Field
              label="WhatsApp (format 628…, tanpa +)"
              value={data.whatsapp}
              onChange={(v) => change({ ...data, whatsapp: v })}
            />
            <Field
              label="Keterangan lokasi"
              value={data.location}
              onChange={(v) => change({ ...data, location: v })}
            />
            <ImageField
              label="Foto Shinta"
              value={data.portrait}
              onChange={(v) => change({ ...data, portrait: v })}
              onError={setMessage}
            />
          </section>
        )}
        {tab === "Galeri" && (
          <>
            <button
              className="button secondary"
              onClick={() =>
                change({
                  ...data,
                  gallery: [
                    ...data.gallery,
                    { image: "", caption: "Proses belajar" },
                  ],
                })
              }
            >
              + Tambah foto
            </button>
            {data.gallery.map((g, i) => (
              <section className="editor-panel editor-fields" key={i}>
                <ImageField
                  label="Foto galeri"
                  value={g.image}
                  onError={setMessage}
                  onChange={(v) =>
                    change({
                      ...data,
                      gallery: data.gallery.map((x, j) =>
                        j === i ? { ...x, image: v } : x,
                      ),
                    })
                  }
                />
                <Field
                  label="Deskripsi foto"
                  value={g.caption}
                  onChange={(v) =>
                    change({
                      ...data,
                      gallery: data.gallery.map((x, j) =>
                        j === i ? { ...x, caption: v } : x,
                      ),
                    })
                  }
                />
                <button
                  className="text-button"
                  onClick={() =>
                    change({
                      ...data,
                      gallery: data.gallery.filter((_, j) => j !== i),
                    })
                  }
                >
                  Hapus dari galeri
                </button>
              </section>
            ))}
          </>
        )}
        {tab === "Testimoni" && (
          <>
            <p>
              Gunakan pernyataan asli dengan izin peserta. Jangan menambahkan
              testimoni fiktif.
            </p>
            <button
              className="button secondary"
              onClick={() =>
                change({
                  ...data,
                  testimonials: [
                    ...data.testimonials,
                    { name: "Nama peserta", quote: "Tulis testimoni asli." },
                  ],
                })
              }
            >
              + Tambah testimoni
            </button>
            {data.testimonials.map((t, i) => (
              <section className="editor-panel editor-fields" key={i}>
                <Field
                  label="Nama tampilan"
                  value={t.name}
                  onChange={(v) =>
                    change({
                      ...data,
                      testimonials: data.testimonials.map((x, j) =>
                        j === i ? { ...x, name: v } : x,
                      ),
                    })
                  }
                />
                <Field
                  label="Testimoni"
                  value={t.quote}
                  multiline
                  onChange={(v) =>
                    change({
                      ...data,
                      testimonials: data.testimonials.map((x, j) =>
                        j === i ? { ...x, quote: v } : x,
                      ),
                    })
                  }
                />
                <button
                  className="text-button"
                  onClick={() =>
                    change({
                      ...data,
                      testimonials: data.testimonials.filter((_, j) => j !== i),
                    })
                  }
                >
                  Hapus testimoni
                </button>
              </section>
            ))}
          </>
        )}
        {tab === "FAQ" && (
          <>
            <button
              className="button secondary"
              onClick={() =>
                change({
                  ...data,
                  faqs: [
                    ...data.faqs,
                    { question: "Pertanyaan baru", answer: "Tulis jawaban." },
                  ],
                })
              }
            >
              + Tambah FAQ
            </button>
            {data.faqs.map((f, i) => (
              <section className="editor-panel editor-fields" key={i}>
                <Field
                  label="Pertanyaan"
                  value={f.question}
                  onChange={(v) =>
                    change({
                      ...data,
                      faqs: data.faqs.map((x, j) =>
                        j === i ? { ...x, question: v } : x,
                      ),
                    })
                  }
                />
                <Field
                  label="Jawaban"
                  value={f.answer}
                  multiline
                  onChange={(v) =>
                    change({
                      ...data,
                      faqs: data.faqs.map((x, j) =>
                        j === i ? { ...x, answer: v } : x,
                      ),
                    })
                  }
                />
                <button
                  className="text-button"
                  onClick={() =>
                    change({
                      ...data,
                      faqs: data.faqs.filter((_, j) => j !== i),
                    })
                  }
                >
                  Hapus FAQ
                </button>
              </section>
            ))}
          </>
        )}
        {tab === "Inquiry" && (
          <>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => loadInquiries()}
            >
              Muat ulang
            </button>
            {loaded && !rows.length && (
              <p>
                Belum ada inquiry. Permintaan baru akan muncul setelah formulir
                berhasil dikirim.
              </p>
            )}
            {rows.map((r) => (
              <article className="editor-panel" key={r.id}>
                <span className="eyebrow">
                  {new Date(r.createdAt).toLocaleString("id-ID")}
                </span>
                <h2>{r.name}</h2>
                <p>
                  {r.programTitle} · {r.city} ·{" "}
                  {r.date || "Waktu belum ditentukan"}
                </p>
                <p>
                  {r.phone} · {r.experience}
                </p>
                <p>{r.goal}</p>
                <small>
                  Referensi harga saat inquiry:{" "}
                  {r.quotedPrice === null
                    ? "Konsultasi"
                    : `Rp${r.quotedPrice.toLocaleString("id-ID")}`}{" "}
                  — bukan konfirmasi pembayaran.
                </small>
                <label>
                  Status
                  <select
                    value={r.status}
                    disabled={busy}
                    onChange={async (e) => {
                      setBusy(true);
                      try {
                        await request("/api/admin/inquiries", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: r.id,
                            etag: r.etag,
                            status: e.target.value,
                          }),
                        });
                        await loadInquiries();
                      } catch (e) {
                        setMessage((e as Error).message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    {[
                      "Baru",
                      "Dihubungi",
                      "Konsultasi",
                      "Terkonfirmasi",
                      "Selesai",
                      "Batal",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </article>
            ))}
            {cursor && (
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => loadInquiries(true)}
              >
                Muat berikutnya
              </button>
            )}
          </>
        )}
        {tab === "Preview" && (
          <section className="editor-panel">
            <p className="notice">
              Pratinjau konten lokal, belum disimpan. Kartu draft juga
              ditampilkan di sini; tautan detail hanya tersedia setelah program
              diterbitkan.
            </p>
            <h2>{data.headline}</h2>
            <p>{data.intro}</p>
            <h3>{data.name}</h3>
            <p>{data.bio}</p>
            <div className="program-grid">
              {data.programs
                .filter((p) => p.status !== "archived")
                .map((p, i) => (
                  <div key={p.id}>
                    <span className="badge">{p.status}</span>
                    <ProgramCard program={p} index={i} />
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
