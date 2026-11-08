# Brand assets

The owner provided a transparent horizontal PNG wordmark and black/white SK monogram on 8 November 2026. These are original brand assets, not a recreated typeface or a generated logo. The horizontal artwork has only fully transparent outside margins cropped and is proportionally reduced to 1600×376. No recoloring, inversion or shape changes are applied. Header/footer and admin branding use the same wordmark.

Browser icons derive from the supplied black/white LOGO 1, flattened onto warm white so transparent corners display consistently. Favicon includes 16, 32 and 48 px; Apple touch icon 180 px; manifest icons 192 and 512 px. The manifest uses browser display; this does not promise an offline app, service worker, or guaranteed installation on every browser. The 1200×630 social image combines the uploaded artwork with descriptive text and a small mint accent. Actual WhatsApp/social preview caching is outside the application and has not been tested on those services.

Only optimized web derivatives are in public/brand. The PSD master and mint/pink source variants are not uploaded to the public repository. Keep originals privately. To regenerate using the owner's original files:

`node scripts/brand-assets.mjs /path/to/original-wordmark.png /path/to/black-white-monogram.png`

This requires dev dependencies installed (`npm ci`). Review the results visually. Brand image metadata uses the exact VERCEL_URL in preview and NEXT_PUBLIC_SITE_URL in production once configured. This does not attach a custom domain or enable indexing before launch gates.

## Audit revision: neutral derivative

Owner approved implementing the audit recommendations. `shinta-kurnia-neutral.png` is a separate derivative: only the lower-right “Online Courses” tagline area (x≥300, y≥195 in the 1600×376 web asset) is made transparent. The tall left initial and main name remain pixel-identical. The existing original wordmark PNG is retained unchanged. Run `node scripts/neutral-logo.mjs` after the original asset generator to recreate the derivative and the updated sharing card. Header/footer/admin use the neutral derivative. Favicon and app icons are unchanged.
