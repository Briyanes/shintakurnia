# Legacy-site inventory — 8 November 2026

This is a partial public inventory, not a WordPress export or full crawl. Public live reads of home and booking returned Bot Verification. Direct reads of class details/gallery were unavailable. Search excerpts establish that these pages existed, but do not confirm current price, availability or image ownership. No bot challenge was bypassed. No private booking/order data was collected.

| Legacy URL path                     | Evidence                                                                   | New destination       | Still needed                                                                                   |
| ----------------------------------- | -------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| `/`                                 | Earlier public text: profile, WhatsApp and categories; latest read blocked | `/`                   | Original photographs, complete profile, current offers                                         |
| `/kursus-tata-rambut/`              | Indexed category descriptions                                              | `/kelas`              | Full WordPress content                                                                         |
| `/kursus-tata-rambut/cutting/`      | Indexed Basic Cutting: 3 days, IDR 5m; Intermediate: 2 days, IDR 5m        | `/kelas/cutting`      | Confirm current prices, all materials, facilities                                              |
| `/kursus-tata-rambut/blow-styling/` | Indexed Basic Blow and Styling Iron: IDR 1m each                           | `/kelas/blow-styling` | Duration, full untruncated curriculum, current prices                                          |
| `/form-booking/`                    | Indexed title; live read blocked                                           | `/konsultasi`         | Original field list, consent, validation, confirmation, notifications and integration behavior |
| `/galery-treatments-service/`       | Indexed captions: Frenchlayer, Long Hush Cut, Classic Bob                  | `/galeri`             | Original image files, captions, rights; distinguish educator work vs student work              |

Colouring material is visible in the category excerpt; no confirmed detail-page URL, price or duration. `/kelas/colouring` is a new category page, not evidence that a corresponding legacy URL exists. Do not guess or publish missing prices. Known gallery captions are inventory only; they are not displayed as fabricated works without photographs.

## Booking parity checklist (blocked pending owner material)

Compare original and new flows using a blank form screenshot/export, with all names/contact details removed:

- Exact required fields and program options, phone/date validation.
- Available class modes, location eligibility, scheduling and capacity behavior.
- Whether old flow saves a lead, sends WhatsApp/email, creates a confirmed booking, or takes payment.
- Consent text, cancellations, refund/deposit and travel cost rules.
- Success, error and duplicate-submission handling; notification recipient and delivery evidence.

New flow is explicitly a consultation request, not confirmed booking. It saves an inquiry and presents an optional WhatsApp continuation; there are no automatic WhatsApp/email sends or payment integration. Do not claim parity until old behavior is verified.

## Owner handoff (no credentials in chat)

Provide a WordPress content export with public pages/program text and original public media, or screenshots of the public pages and blank booking form. Remove private entries, form submissions, credentials and tokens. Customer/order databases and full hosting backups stay with the owner in secure storage, not this public GitHub repository.

Independently back up WordPress files/database and store files/orders/products, verify recovery, inventory DNS/MX and all subdomains. Store deactivation and DNS cutover remain blocked until backup and launch gates are satisfied. Do not disable the existing bot protection as a shortcut.

The redirects here take effect only on this Next.js deployment; the old domain is unchanged. Query strings should survive the redirects; only the new `program` identifiers are interpreted, not unknown old form fields. Full URL export is still required for a complete redirect map.
