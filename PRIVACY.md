# Privacy Note

Open APA Desk V0 is designed to keep paper data inside the user's Google
workspace.

## What Stays Local To The User's Google Account

- paper profile metadata
- per-document references
- inserted citation records
- generated section anchors

## Google Permissions

The current Apps Script build no longer requests full Google Drive or Google
Sheets scope.

Open APA Desk uses current-document Docs access for controlled paper setup,
citations, References rebuild, and marker removal. For submission prep, users
make a copy in Google Docs and run `Prepare Current Copy` on that copy. Open APA
Desk removes hidden marker paragraphs from the current document only.

V0 has no Open APA Desk server. Reusable cross-document reference library sync
is deferred from Marketplace V0 to avoid Google Sheets OAuth scope.

## External Requests

DOI lookup uses Crossref. When a user enters a DOI and clicks lookup, Open APA
Desk sends that DOI to Crossref and receives publication metadata. DOI lookup is
optional; manual entry remains available.

DOI lookup requires the project maintainer to configure a real
`CROSSREF_MAILTO` contact email in Apps Script script properties. If that
property is missing, malformed, or still uses an example address, Open APA Desk
stops before sending a Crossref request.

## What V0 Does Not Do

- no Open APA Desk account
- no backend server
- no AI generation or summarization calls
- no URL scraping
- no analytics service
- no sale or sharing of user document data by this project

Google Docs, Apps Script, and Crossref each remain governed by their own terms
and privacy policies.
