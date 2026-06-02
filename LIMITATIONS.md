# Known Limitations

Open APA Desk V0 is intentionally narrow.

- APA 7 only.
- Common source types only: journal article, book, book chapter, website, and report.
- DOI lookup is limited to Crossref journal metadata.
- URL lookup and webpage scraping are not included.
- Reference formatting covers common student-paper cases, not every APA edge case.
- Parenthetical and narrative citations support common author-date cases,
  no-author title fallback, missing dates as `n.d.`, and optional
  page/paragraph locators.
- Multiple selected sources can be inserted as one grouped parenthetical
  citation sorted like the References list.
- Citation insertion does not yet support same-author same-year `a`/`b`
  disambiguation, same-surname initial disambiguation, or automatic quote
  detection.
- Generated sections are editable by the user, so the tool may not detect every manual change.
- Generated sections currently use Open APA Desk marker paragraphs styled as tiny white text for smoke-test reliability. `Prepare Current Copy` removes marker paragraphs from the current document, so users should run it on a Google Docs copy prepared for submission.
- Rebuild References replaces only the marked Open APA Desk References section once it exists. It does not delete legacy unmarked `References` headings.
- The tool does not verify whether citations in the body exactly match all references.
- Legacy automatic Clean Copy was verified in a live Google Docs runtime and
  exported to PDF/DOCX, but it required full Google Drive scope. The active
  Marketplace-oriented build removes markers from the current document instead
  and needs a copied-template smoke pass.
- Student-paper dynamic page-number automation is not implemented. Use Google
  Docs' built-in page-number UI or a prepared template before submission.
- The tool is not affiliated with, endorsed by, or certified by the American Psychological Association.

Users remain responsible for checking instructor, institution, and APA
requirements before submission.
