# Google Sheets contact integration

The browser posts to `/.netlify/functions/contact`. A Netlify function validates and rate-limits the request, then sends it to Apps Script with a server-only shared secret. Apps Script saves the enquiry and confirms its request ID. The page shows success only for a confirmed save. No email app is required.

## Google setup

1. Create an Apps Script project in the CyberDefend Google account and paste `integrations/google-apps-script/Code.gs` into its editor.
2. Run `setup` once and authorize spreadsheet access. It creates a private spreadsheet named **CyberDefend — Website enquiries** and records its ID in Script Properties. Running setup again reuses that spreadsheet.
3. Set `CONTACT_SHARED_SECRET` in Script Properties to a randomly generated secret of at least 32 bytes. Never put it in browser JavaScript, the repository or chat. The spreadsheet itself must remain private.
4. Deploy as a **Web app**, execute as the owner, with access **Anyone**. This exposes the write endpoint, not the sheet. It only accepts requests containing the shared secret. Copy the deployment `/exec` URL.

## Netlify setup

Link the repository to the existing preview project so Netlify builds the function as well as the static pages. `.netlify/` is already ignored by Git. Set these variables in Netlify:

- `SITE_TARGET=preview` for the combined preview. Keep `LAUNCH_APPROVED` unset.
- `CONTACT_APPS_SCRIPT_URL`: the Apps Script `/exec` URL.
- `CONTACT_SHARED_SECRET`: the same secret as Google; scope must include **Functions**.

The checked-in build command is `node scripts/netlify-build.mjs`, publishing `dist/deploy`. Redeploy after changing function variables. A static ZIP upload alone cannot deploy the function.

## Acceptance checks

Send a clearly marked test enquiry and verify one row in the private sheet. Confirm an on-page success message, retry the same request ID and confirm no duplicate row. Verify invalid email, missing fields, unavailable endpoint and rate-limit responses do not show success. Retain form details on failure. Delete test rows after review if desired.

Google Sheets is the enquiry inbox. This version does not send email notifications or customer confirmation emails. Apps Script/Netlify quotas apply. If a reply is lost after saving, a retry uses the same request ID to avoid another row. Reloading the page starts a new request.

For custom-domain launch, set the appropriate `SITE_TARGET` on each of the three Netlify projects and configure the same function variables on every site exposing the form. Apply the production indexing steps in DEPLOYMENT.md separately.
