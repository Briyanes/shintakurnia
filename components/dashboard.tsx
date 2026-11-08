"use client";

import { Brand } from "./brand";
import { useState, useEffect, createContext, useContext } from "react";
import {
  Home,
  BookOpen,
  MessageSquare,
  MoreHorizontal,
  Eye,
  Save,
  ExternalLink,
} from "lucide-react";
import { ProgramEditor } from "./program-editor";
import { newProgram, whatsappContact } from "@/lib/dashboard-ui";
const DemoContext = createContext(false);
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
      <Brand label="PRIVATE DASHBOARD" />
      <span className="eyebrow">SELAMAT DATANG</span>
      <h1>
        Kelola kelasmu.
        <br />
        <em>Mulai dari sini.</em>
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
export function Field({
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
export function ImageField({
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
  const demo = useContext(DemoContext);
  const [busy, setBusy] = useState(false);
  return (
    <div className="image-field">
      <label>
        {label}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy || demo}
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
  demo = false,
}: {
  initial: Content;
  initialEtag: string | null;
  demo?: boolean;
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
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const [inquiryFilter, setInquiryFilter] = useState("Semua");
  function navigate(next: string) {
    setTab(next);
    if (next === "Inquiry" && !loaded) void loadInquiries();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function addProgram() {
    const added = newProgram();
    change({ ...data, programs: [...data.programs, added] });
    return added.id;
  }

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
    if (demo) {
      setMessage(
        "Demo desain: perubahan hanya di layar ini, tidak disimpan ke server.",
      );
      return;
    }
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
    if (demo) {
      setRows([]);
      setLoaded(true);
      setMessage("Demo desain tidak membaca data inquiry.");
      return;
    }
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
  async function logout() {
    if (dirty && !confirm("Keluar tanpa menyimpan perubahan?")) return;
    if (demo) {
      setMessage("Demo desain: tidak ada sesi login aktif.");
      return;
    }
    try {
      await request("/api/admin/logout", { method: "POST" });
      location.reload();
    } catch (e) {
      setMessage((e as Error).message);
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
    <DemoContext.Provider value={demo}>
      <div className="dashboard redesigned-dashboard">
        <aside className="admin-sidebar">
          <Brand label="YOUR CREATIVE SPACE" compact />
          <nav aria-label="Dashboard">
            {tabs.map((t) => (
              <button
                key={t}
                className={tab === t ? "selected" : ""}
                aria-current={tab === t ? "page" : undefined}
                onClick={() => {
                  navigate(t);
                }}
              >
                {t}
              </button>
            ))}
          </nav>
          <a href="/" target="_blank" rel="noopener noreferrer">
            Buka website ↗
          </a>
          <button className="text-button" onClick={logout}>
            Keluar
          </button>
        </aside>
        <main className="admin-main">
          {demo && (
            <p className="demo-banner" role="status">
              DEMO DESAIN · Data contoh · Tidak terhubung ke penyimpanan atau
              akun admin.
            </p>
          )}
          <div className="admin-top">
            <div>
              <span className="eyebrow">DASHBOARD / {tab.toUpperCase()}</span>
              <h1>
                {tab === "Ringkasan"
                  ? "Halo, Shinta."
                  : tab === "Lainnya"
                    ? "Konten & pengaturan"
                    : tab}
              </h1>
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
              <section className="admin-welcome">
                <span className="eyebrow">RUANG KELOLAMU</span>
                <h2>Kelasmu, dalam genggaman.</h2>
                <p>
                  Perbarui program dan tanggapi calon peserta tanpa membuka
                  komputer.
                </p>
                <button className="button" onClick={() => navigate("Program")}>
                  Kelola program <BookOpen size={16} />
                </button>
              </section>
              <div className="stats">
                <article>
                  <span>Program terbit</span>
                  <strong>
                    {
                      data.programs.filter((p) => p.status === "published")
                        .length
                    }
                  </strong>
                </article>
                <article>
                  <span>Draft</span>
                  <strong>
                    {data.programs.filter((p) => p.status === "draft").length}
                  </strong>
                </article>
                <article>
                  <span>Inquiry baru</span>
                  <strong>
                    {loaded
                      ? rows.filter((r) => r.status === "Baru").length
                      : "—"}
                  </strong>
                  <small>
                    {loaded
                      ? cursor
                        ? "Dari inquiry yang dimuat"
                        : "Dari inquiry yang dimuat"
                      : "Belum dimuat"}
                  </small>
                </article>
              </div>
              <section className="admin-quick-actions">
                <button onClick={() => navigate("Program")}>
                  <BookOpen />
                  <strong>Program & harga</strong>
                  <span>Tambah atau perbarui kelas</span>
                </button>
                <button onClick={() => navigate("Inquiry")}>
                  <MessageSquare />
                  <strong>Calon peserta</strong>
                  <span>Lihat permintaan konsultasi</span>
                </button>
                <button onClick={() => navigate("Profil")}>
                  <Home />
                  <strong>Profil website</strong>
                  <span>Atur foto dan informasi Shinta</span>
                </button>
              </section>
              <p className="field-note">
                Inquiry bukan booking terkonfirmasi. Jadwal dan biaya perlu
                disepakati langsung.
              </p>
            </>
          )}
          {tab === "Program" && (
            <ProgramEditor
              programs={data.programs}
              onChange={program}
              onAdd={addProgram}
              onError={setMessage}
            />
          )}
          {tab === "Lainnya" && (
            <section className="more-grid">
              {["Profil", "Galeri", "Testimoni", "FAQ", "Preview"].map((t) => (
                <button key={t} onClick={() => navigate(t)}>
                  <strong>{t}</strong>
                  <span>Kelola {t.toLowerCase()} →</span>
                </button>
              ))}
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} />
                <strong>Buka website</strong>
                <span>Lihat hasil yang sudah diterbitkan</span>
              </a>
              <button onClick={logout}>
                <strong>Keluar akun</strong>
                <span>Akhiri sesi di perangkat ini</span>
              </button>
            </section>
          )}
          {tab === "Profil" && (
            <section className="editor-panel editor-fields">
              <Field
                label="Nama"
                value={data.name}
                onChange={(v) => change({ ...data, name: v })}
              />
              <Field
                label="Headline beranda (pisahkan baris dengan Enter)"
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
                        testimonials: data.testimonials.filter(
                          (_, j) => j !== i,
                        ),
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
              <div className="inquiry-toolbar">
                <label>
                  Filter status
                  <select
                    value={inquiryFilter}
                    onChange={(e) => setInquiryFilter(e.target.value)}
                  >
                    {[
                      "Semua",
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
                <p>
                  Status diperbarui langsung. Data harga saat inquiry tetap
                  dipertahankan.
                </p>
              </div>
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => loadInquiries()}
              >
                Muat ulang
              </button>
              {loaded && !rows.length && (
                <p>
                  Belum ada inquiry. Permintaan baru akan muncul setelah
                  formulir berhasil dikirim.
                </p>
              )}
              {rows
                .filter(
                  (r) =>
                    inquiryFilter === "Semua" || r.status === inquiryFilter,
                )
                .map((r) => (
                  <article className="editor-panel inquiry-card" key={r.id}>
                    <span className="state-tag">{r.status}</span>
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
                    {whatsappContact(r.phone) && (
                      <a
                        className="button secondary"
                        href={whatsappContact(r.phone)!}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Hubungi WhatsApp <ExternalLink size={16} />
                      </a>
                    )}
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
              {loaded &&
                rows.length > 0 &&
                !rows.some(
                  (r) =>
                    inquiryFilter === "Semua" || r.status === inquiryFilter,
                ) && (
                  <p className="admin-empty">
                    Tidak ada inquiry dengan status ini pada data yang dimuat.
                  </p>
                )}
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
                ditampilkan di sini; tautan detail hanya tersedia setelah
                program diterbitkan.
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
        <div className="admin-savebar">
          <span>
            {dirty ? "Perubahan belum disimpan" : "Semua perubahan tersimpan"}
            {demo ? " · Demo" : ""}
          </span>
          <div>
            <button
              className="button secondary"
              onClick={() => navigate("Preview")}
            >
              <Eye size={16} /> Preview
            </button>
            <button className="button" disabled={busy || !dirty} onClick={save}>
              <Save size={16} />
              {busy ? "Memproses…" : "Simpan perubahan"}
            </button>
          </div>
        </div>
        <nav className="admin-bottom-nav" aria-label="Navigasi aplikasi">
          {[
            { tab: "Ringkasan", label: "Beranda", icon: Home },
            { tab: "Program", label: "Program", icon: BookOpen },
            { tab: "Inquiry", label: "Inquiry", icon: MessageSquare },
            { tab: "Lainnya", label: "Lainnya", icon: MoreHorizontal },
          ].map((item) => (
            <button
              key={item.tab}
              aria-current={
                tab === item.tab ||
                (item.tab === "Lainnya" &&
                  !["Ringkasan", "Program", "Inquiry"].includes(tab))
                  ? "page"
                  : undefined
              }
              onClick={() => navigate(item.tab)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </DemoContext.Provider>
  );
}
