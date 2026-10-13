# GitHub → Netlify → custom domains

## Repository
Repository name: `cyberdefend_revamp`. Source is a dependency-free Node 22 static build. It is one repository with shared templates, assets and data, producing three separate sites. There are no API keys or credentials in the source.

Create the repository in your intended GitHub account or organisation and push the main branch. A local initial commit is included. Use a private repository unless you intentionally want the source public. Do not overwrite the existing CyberDefend repository.

## Netlify configuration
Connect the same GitHub repository to three Netlify projects. The checked-in netlify.toml defines the build command and publish directory. Leave the base directory at the repository root. For each project, set the following environment variable in Netlify:

| Project | SITE_TARGET | Intended production domain |
|---|---|---|
| Main | main | cyberdefend.in |
| Services | services | services.cyberdefend.in |
| Academy | academy | academy.cyberdefend.in |

Build command: `node scripts/netlify-build.mjs`
Publish directory: `dist/deploy`
Node: 22

Deploys are noindex by default. When production content and domain mappings are approved, set `LAUNCH_APPROVED=true` for the production context only and redeploy. The build also checks `CONTEXT=production`; preview builds remain noindex. No secrets are needed by this website.

The three domain builds deliberately link across the final domains. Before domain cutover, use the combined portable preview or temporarily provide a staging-domain mapping in scripts/build.mjs to test cross-site navigation. Do not confuse cross-links to the old production sites with the new sites being deployed.

## Current implementation
- Static pre-rendered HTML; no framework runtime; Manrope fonts are self-hosted.
- Contact form composes an email in the visitor's email app. It does not store submissions or send email from a backend. The UI says this explicitly. If you want a web-submitted enquiry workflow, implement Netlify Forms or another agreed backend, update the privacy notice, configure notifications and verify receipt.
- Office directions use the supplied share.google link. The resolved address was not available (HTTP 429); no guessed street address is displayed.
- Social destinations come from the visible-footer link data in the existing sites' JavaScript bundles. Reachability and account ownership were not independently authenticated.
- Certification offers use quote requests. Add named products/prices only after checking current issuer terms and business authority.

## Before production
Confirm the service catalogue, training availability and internship terms. Review the concise privacy and website-information pages with the business owner; these describe the implemented enquiry flow and do not substitute for service contracts, purchase terms or a comprehensive business privacy policy.

Test real devices and keyboard navigation, mobile menu, learning filters, email-app behaviour, the office link, all social links and cross-domain navigation. Audit rendered accessibility and measure performance after deployment. Automated build checks are not a full accessibility certification. No live browser audit was possible in this build environment.

Legacy routes identified in the previous sites are covered by `src/data/redirects.json` and retained course/article pages. Automated checks cover 44 redirect cases including query preservation. Add any further URLs found in Search Console or access logs before migration. Unknown URLs return a genuine 404; there is no blanket home-page redirect. Keep permanent redirects for at least a year and preferably indefinitely.

The production main build redirects www to the apex domain. Add www.cyberdefend.in as a domain alias on the main Netlify project so the rule receives those requests. Both domains need working DNS and TLS. Redirect checks simulate the rules locally; verify HTTP statuses, destination and query strings on Netlify after deployment.

## Search visibility
Each domain has its own canonical URLs and sitemap.xml. The site supplies unique page titles/descriptions, social cards, Organization/WebSite/WebPage and applicable Service/Breadcrumb structured data. Career and case-study enquiry pages are noindex and excluded from sitemaps. Default and preview builds allow crawling but emit noindex in metadata and response headers so crawlers can see that directive. Noindex is not access control.

At launch, verify the cyberdefend.in domain property in Google Search Console, submit all three domain sitemaps and inspect representative pages. Check production HTML and headers have no unintended noindex. Monitor crawl errors, Core Web Vitals and search performance after cutover. Confirm business details, enrich service and programme pages with actual deliverables and maintain helpful original content. Technical SEO cannot guarantee a particular search ranking.

## Domain cutover
If redeploying in the existing Netlify projects, existing DNS may remain correct. If moving to new projects, transfer domain assignments using Netlify's current guidance and configure the exact DNS values shown for each destination project. Preserve mail-related MX/TXT/SPF/DKIM/DMARC records and other unrelated records. Verify apex/www behaviour and HTTPS on all three domains. Do not guess IP addresses or replace nameservers unnecessarily.

Keep the old deployments available for rollback. Confirm DNS resolution, HTTPS, canonicals, sitemap, robots, 404s and all user journeys after cutover.

Netlify deployment and DNS cutover are separate owner actions; source configuration does not deploy or change DNS.

References checked 12 October 2026:
- https://docs.netlify.com/build/configure-builds/monorepos/
- https://docs.netlify.com/build/configure-builds/file-based-configuration/
- https://docs.netlify.com/manage/domains/get-started-with-domains/
- https://docs.netlify.com/manage/forms/setup/
