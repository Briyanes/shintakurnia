# Editorial redesign — November 2026

Owner requested a more personal, less template-like public site. This revision removes large abstract hero artwork, floating badges, repeated colored illustration cards, fake portrait monograms and decorative English slogans. Public navigation and supporting copy use Indonesian. Uploaded logo is kept intact (including the original words “Online Courses”); online classes are still explicitly planned, not available by implication.

The homepage uses a typographic introduction, a practical consultation note, labeled class facts and horizontal program rows with actual price/duration information. Charcoal and ivory lead, mint is restrained. No stock portraits, AI people, invented work samples, testimonials or credentials have been added. Real portrait, program and gallery uploads remain supported. Until owner photos are supplied, the hero uses helpful text, not a fake photo placeholder.

Headline/intro updates apply to seed content for installations without saved content. Existing saved owner content is not overwritten by a code deployment. Prices, program identifiers, redirects, inquiry handlers, authentication and storage schemas are unchanged. Global controls share the simpler colors/type, while dashboard structure remains functional; authenticated dashboard visual testing is still blocked by owner credential setup.

Review on preview before merging. This does not migrate the old domain/store, activate admin credentials, confirm old prices or complete photo migration.

## Design audit refinements

- Compact hero with two clear actions: view classes and optional WhatsApp consultation. Shorter Indonesian seed headline; saved CMS copy remains untouched. Compact supporting note replaces repeated CTAs.
- Classes grouped by existing CMS level (fundamental/basic/pemula, intermediate/advanced, unknown→consultation). No unverified audience or outcome added. Owner still needs to validate suitability and prerequisites. Custom levels safely appear under consultation.
- Neutral derivative logo used; original master preserved. Mobile native details menu exposes all links rather than hiding About/Gallery/FAQ. Menu is keyboard operable with native Enter/Space behavior, no JS dependency.
- Detail DOM and mobile layout order: introduction → price/CTA → curriculum. No bottom-fixed overlay obscures content. Desktop price stays in side column.
- Consultation intro shortened. Travel/materials disclaimer moved next to city input via aria-describedby. Inputs use 16px text to reduce mobile focus zoom. A shared line-icon WhatsApp component replaces platform-colored arrow emoji on contact actions.
- Existing gallery/photos are placed before signup process when available; no empty evidence block or fake credentials. Original photos, verified teaching experience and student outcomes remain a launch dependency, not completed by CSS.

Testing includes component behavior, image-derivative bounds, palette contrast for primary/muted/button colors, typecheck, build and preview flows. This is not full WCAG certification or a measured production Core Web Vitals audit. Authenticated dashboard remains blocked by owner credential setup. No changes to stored prices, booking data, authentication or DNS.
