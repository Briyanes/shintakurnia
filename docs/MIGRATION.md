# Migration & launch checklist

## Content provenance

Public pages/index excerpts inspected 2026-11-08:

- https://shintakurnia.com/ — introduction, WhatsApp, categories.
- https://shintakurnia.com/kursus-tata-rambut/cutting/ — Basic 3 days IDR 5m; Intermediate 2 days IDR 5m. Direct fetch unavailable; indexed excerpts only.
- https://shintakurnia.com/kursus-tata-rambut/blow-styling/ — Basic Blow and Styling Iron IDR 1m each. Indexed excerpts only; duration unknown.
- Colouring curriculum from main page; price and duration unknown.
- https://shintakurnia.com/galery-treatments-service/ — indexed; original images not exported.

These are historical references, not confirmed current offers. Owner must validate all prices, facilities, outcomes, terms, contact details and duration. No testimonials, certificates, credentials, student counts, employment guarantees, images or urgency claims were invented. Illustrations are original decorative SVG/CSS, not photographs of real work.

## Before changing DNS

- Export WordPress content and original media; full database and files backup from current host. Store securely outside the public repository.
- Export store database, orders, customers, products and files. Confirm recovery works before disabling store. No permanent deletion authorized by this implementation.
- Inventory existing DNS, email/MX/TXT, subdomains, analytics and all indexed URLs; preserve email services.
- Validate current price, travel/accommodation, supplies/models, location availability, deposit, cancellation/refund and rescheduling policy with Shinta.
- Validate name/photo/testimonial permissions, privacy notice and data retention policy.
- Configure admin password hash, validate login + CRUD + upload + inquiry status on preview. Current browser verification cannot cover authenticated features without owner configuration.
- Verify at 375, 768 and 1280 widths, keyboard navigation, detail/form/error/empty states; measure performance after real images.
- Review redirect map. Known class/category, booking and gallery URLs resolve to relevant dedicated pages; refine after complete URL export. Do not claim SEO migration complete.
- Review costs and rate limits. Small-scale JSON content uses private Blob with optimistic concurrency and immutable pre-change backups. Inquiry files are separate; snapshots keep original price. Not a relational database or financial ledger.

## Deployment sequence

Preview first. Merge PR only after review. Production default Vercel hostname is not a domain migration. Configure custom domain only after approval and backups. Set NEXT_PUBLIC_SITE_URL only after public launch (enables indexing in production). Add sitemap/canonical once final hostname and URL inventory approved. Do not configure redirects from store to unrelated class pages blindly.

## Operations

Content lives under app/{production|preview|development}/content.json in one private store. Preview data is separate from production, shared across preview branches. Media URLs are public through an application route by random UUID (never store confidential media). Inquiries and backups have no public route. Admin APIs require signed HttpOnly SameSite sessions, same-origin writes and version checks. Login and public form writes are persistently rate limited. Rate-limit files and inquiry data require periodic retention review; no automatic deletion yet. Private Blob backups stay in the same store, not an independent disaster-recovery system. Export backups periodically to secure independent storage.

Before launch implement and exercise an owner-approved retention/deletion procedure for inquiries and rate-limit records. Current admin cannot delete inquiries. Use secure storage administration to honor deletion requests; never expose customer data in chat or repository.

Rollback: keep old hosting intact during launch. Restore DNS to recorded old values if needed. For content rollback, recover a private backup into content.json only after exporting current data; a redeploy alone does not revert stored data.

## Follow-up public audit

Known booking URL `/form-booking/` now redirects to `/konsultasi`; class index and category URLs resolve to dedicated catalog pages rather than an unrelated homepage fragment. Gallery URL resolves to `/galeri`, even when no photographs are published. The empty state says documentation is being prepared and never substitutes illustrations for claimed real work. See [partial legacy inventory](LEGACY-INVENTORY.md) for source limitations and blocked booking-parity checks. Category membership follows the existing CMS category names (`Cutting`, `Colouring`, `Styling` / `Blow & Styling`); custom categories remain on the all-programs page.
