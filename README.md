# Shinta Kurnia — Private Hair Education

Next.js responsive public site, 1-on-1 program detail, inquiry form and private CMS. Original editorial SVG/CSS artwork; no invented student testimonials. Historical program prices require owner confirmation.

## Development

Node 24+ and npm. `npm ci`, `npm run dev`. `npm test`, `npm run typecheck`, `npm run build`.

Public seed content works without storage locally. Admin and form writes require connected private Vercel Blob. Server uses managed OIDC via BLOB_STORE_ID; never put credentials in code. Environment data and `.vercel` must not be committed.

## Activate admin (owner action, no default password)

1. On your own computer, run `npm run admin:hash` in this checkout. Enter a strong unique password, 14–256 characters. The terminal outputs its salted scrypt hash. Do not share password/hash in chat.
2. Set `ADMIN_PASSWORD_HASH` through Vercel project environment variables for Preview and Production yourself (or run `vercel env add ADMIN_PASSWORD_HASH preview` and `vercel env add ADMIN_PASSWORD_HASH production` interactively). Set the full generated value, not the plaintext password.
3. Redeploy the intended environment, then open `/admin`. Login is unavailable until both hash and storage exist. Hash rotation invalidates all sessions.
4. Verify program draft/publish/archive, price edits, photo uploads, profile, FAQ, gallery, testimonials, inquiry submission/status and logout yourself before launch. Use fictional non-sensitive data for testing and remove it before launch.

Admin cookies expire after 24 hours; login allows five attempts/network/15 minutes. Form allows five submissions/network/hour plus honeypot and server-side validation. Shared networks may reach limits together. No email or WhatsApp message is sent automatically; successful inquiry is saved and offers an explicit WhatsApp link.

## Editing

Save changes explicitly. Draft/archived programs are not public; local Preview tab is a content preview, not a full draft URL. New programs default to draft. Changing a live slug requires a redirect. Media upload accepts JPG/PNG/WebP up to 4 MB and checks signatures. Media is intended to be publicly displayed; do not upload private documents. Images and testimonials require permission.

Content saves use ETag preconditions and pre-change backup. On conflict reload before editing. Preview and production content/inquiries are separate. Deploying code does not migrate WordPress, move preview data to production or transfer a domain.

## Pending owner setup / launch gates

- Confirm historical prices, curriculum, supplies, location/travel, refund and payment terms.
- Export WordPress, store and original media; retain independent backups before disabling store.
- Set admin login secret; complete authenticated acceptance tests.
- Approve privacy/retention/deletion policy and manage stored inquiries accordingly.
- Review preview and approve production/custom domain separately.

See [migration checklist](docs/MIGRATION.md). Store, hosting and DNS have not been modified by this code.

## Dashboard on your phone

Open `/admin` and follow “Cara memasang” / the real browser-provided install button. It starts at the dashboard in a standalone window, not the marketing homepage. Installation never bypasses login. Internet is required to edit/save; the offline page contains no private data. See [PWA security and phone acceptance checks](docs/DASHBOARD-PWA.md).
