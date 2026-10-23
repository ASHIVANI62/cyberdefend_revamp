# Academy current articles

`src/data/current-posts.json` is the collection for new articles. `src/current-posts.mjs` validates and renders it, including the current `/blogs/` listing. `src/legacy.mjs` continues to render the preserved archive and its existing routes. Do not refresh archive dates or replace archived articles with new posts.

## Adding an article

1. Fetch current `main` and read repository instructions. Check existing posts and the live site before creating anything on a retry. Only one new post is permitted for each publication date in Asia/Kolkata.
2. Research primary sources. Add a unique stable lowercase `slug`, title, meta description, summary, category and `author: "CyberDefend"`. Publication and modification dates use `YYYY-MM-DD`; keep the original publication date when updating. Change `dateModified` only when the article actually changes.
3. Add at least two substantive source objects with `id`, `title` and public HTTPS `url`. Link claims to sources in the body. Distinguish confirmed reporting, analysis and illustrative examples; never invent tests or reviewer identities.
4. Use structured content blocks: `heading` (`id`, `text`), `paragraph` (`content`), `list` (`items`) or `table` (`caption`, `headers`, `rows`). Inline parts contain `text` and optionally `source` (a source ID) or `internal` (an existing route key). Plain text is escaped. Raw HTML is not supported. Headings render as H2; the page supplies the only H1. Sources and contents are rendered automatically.
5. Run `PRODUCTION=true npm test` to verify indexability as well as the build, internal links, preserved redirects, form checks and article safeguards. Article styles are scoped in `src/assets/blog.css`. No dependencies are required.
6. Commit all article/template changes atomically against freshly read `main` using an expected-SHA lease. If main has moved, incorporate concurrent changes and revalidate; never force-overwrite them. Avoid duplicate posts when recovering a failed publication.
7. Let Netlify build the Academy project. Verify deploy state, article, listing and sitemap on the public Academy domain before claiming publication. If a deploy fails, fix forward using the same article; retain the draft in the repository and accurately report the blocker.

Metadata includes organisation authorship, BlogPosting JSON-LD, article Open Graph dates, canonical URL and article sitemap lastmod. New routes join the sitemap through the normal build. Do not modify DNS, contact secrets or unrelated pages as part of blog publication.
