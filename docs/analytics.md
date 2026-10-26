# Google Analytics 4

Measurement ID: `G-BFH57PLZRQ`. The shared page shell loads `analytics.js` across the three production domains. Localhost and Netlify preview hostnames do not collect analytics.

Basic opt-in consent: no Google tag request before acceptance. A first-party consent preference lasts six months across subdomains. The footer offers Analytics preferences to withdraw consent. Advertising consent remains denied, Google signals and ad personalisation are disabled. Withdrawal disables collection and expires readable GA cookies.

Events: the config sends one page view per full navigation; `whatsapp_click` records a WhatsApp link click, not a delivered message; `generate_lead` fires only after the contact endpoint confirms success with the matching request ID. Custom events contain only a fixed contact method, never form contents or link query parameters. Page locations and referrers omit query strings and fragments.

## Required property-side check

In GA4 Admin > Data streams > Web stream > Enhanced measurement, disable automatic outbound clicks and form interactions. The site's custom events already cover those actions without forwarding link URLs or form metadata. Also disable site search and history-change page views if enabled; this is a static, full-navigation site. Do not configure additional tags, user-provided data collection or user IDs without a privacy review. These property settings cannot be verified from repository access alone.

Verify receipt in GA4 Realtime after accepting analytics on a production domain. Do not submit invented enquiries to test production. Mark `generate_lead` as a key event if desired. Reporting will exclude visitors who decline or block analytics. No historical data is backfilled.

Run `npm test` for integration, privacy payload and consent unit checks. These checks do not assert receipt in the GA4 account or replace browser/network QA.
