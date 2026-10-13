# cyberdefend_revamp

A new light-theme, multi-domain website: 24 content pages (21 indexable URLs), shared brand system, static HTML, responsive navigation, learning-area filters and an email enquiry composer. No founder profiles. The revised shield and naturally proportioned wordmark are used throughout. The homepage has a new editorial layout and the Manrope typeface is self-hosted.

## Start
Requires Node 22 or later. No dependency installation is needed.

```
npm test
npm run preview
```

Open http://127.0.0.1:4173. `npm run build` creates `dist/preview` (all pages in one site) and independent `dist/main`, `dist/services`, `dist/academy` outputs. The delivered `review/` folder is a portable version: open `review/index.html` directly after extracting the archive.

## Repository structure
- `src/data/site.json`: contact, office and social information
- `src/assets/`: brand assets, CSS and browser behaviour
- `scripts/build.mjs`: shared page components, interior content and static build
- `src/home.mjs`: redesigned homepage
- `scripts/netlify-build.mjs`: choose domain output from SITE_TARGET
- `src/seo.mjs`: canonical metadata and structured data
- `src/data/redirects.json`: legacy route mapping
- `scripts/check.mjs` and `scripts/check-seo.mjs`: links, assets, schema, redirects and indexing checks
- `scripts/serve.mjs`: local preview server
- `.github/workflows/check.yml`: CI build and validation
- `docs/DEPLOYMENT.md`: GitHub, Netlify and domain cutover
- `docs/CONTENT-SOURCES.md`: verified inputs and remaining business checks

## Content and deployment status
This is a complete first website implementation, ready for content review and connected deployment. It is not a live deployment. Certification prices and course intake dates are intentionally enquiry-led. The email composer does not send on the user's behalf. Existing social URLs are carried over; office directions use the supplied link. No founder details or invented testimonials are included.

Default builds remain noindex. See deployment instructions before launch. Rendered browser/device QA and live performance checks remain outstanding.
