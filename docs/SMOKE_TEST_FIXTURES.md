# Smoke Test Fixtures

Date: 2026-06-02

Use these public-safe fixtures for the final copied-template smoke pass. Keep
private Google Doc URLs, Apps Script URLs, script IDs, tester emails, PDF
exports, and DOCX exports out of this file and out of the public repository.

## Paper Setup

Enter these values in the sidebar Paper section:

```text
Title: Testing Open APA Desk
Author: Alex Student
Institution: Example University
Course: APA 101
Instructor: Jordan Instructor
Due date: 06/02/2026
```

Expected visual result:

- A centered student title block is inserted.
- The document body starts with a centered copy of `Testing Open APA Desk`.
- Re-running setup replaces the controlled starter section instead of
  duplicating a second title block.

Page number check:

- Use the prepared template page number or Google Docs'
  `Insert > Page numbers` UI.
- Confirm page number `1` is visible in the header before marking that row
  `PASS`.

## DOI Article

Use DOI:

```text
10.1037/0003-066x.59.1.29
```

Expected Crossref fields:

```text
Author: Ray, Oakley
Year: 2004
Title: How the Mind Hurts and Heals the Body.
Journal: American Psychologist
Volume: 59
Issue: 1
Pages: 29-40
DOI: 10.1037/0003-066x.59.1.29
```

Expected reference entry:

```text
Ray, O. (2004). How the Mind Hurts and Heals the Body. American Psychologist, 59(1), 29-40. https://doi.org/10.1037/0003-066x.59.1.29
```

Expected citations:

```text
Parenthetical: (Ray, 2004)
Narrative: Ray (2004)
Direct quote locator 23: (Ray, 2004, p. 23)
```

Duplicate DOI check:

- Save the DOI article once.
- Enter the same DOI again and save/update.
- The saved reference list should still show one Ray article, not two.

## Manual Book

Enter these values manually:

```text
Source type: Book
Author: Garcia, Lena
Year: 2021
Title: Writing in public
Publisher: River Press
```

Expected reference entry:

```text
Garcia, L. (2021). Writing in public. River Press.
```

Expected citations:

```text
Parenthetical: (Garcia, 2021)
Narrative: Garcia (2021)
Direct quote locator 23: (Garcia, 2021, p. 23)
```

Expected grouped citation with the DOI article selected too:

```text
(Garcia, 2021; Ray, 2004)
```

## Final Evidence Fields

Record these public-safe observed values in the private final smoke evidence
file after the live check:

```text
Parenthetical citation observed: (Ray, 2004)
Narrative citation observed: Ray (2004)
Grouped citation observed: (Garcia, 2021; Ray, 2004)
References entry for DOI article observed: Ray, O. (2004). How the Mind Hurts and Heals the Body. American Psychologist, 59(1), 29-40. https://doi.org/10.1037/0003-066x.59.1.29
References entry for manual book observed: Garcia, L. (2021). Writing in public. River Press.
Known APA limitation observed, if any: none
```

Do not mark the final evidence file ready until PDF and DOCX exports have been
created under `private/smoke-evidence/exports/`, visually checked, and scanned
with `npm run smoke:exports`.
