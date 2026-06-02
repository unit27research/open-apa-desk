# APA Citation Audit

Date: 2026-05-31

## Sources Checked

- Purdue OWL, APA 7 in-text citation basics:
  https://owl.purdue.edu/owl/research_and_citation/apa_style/apa_formatting_and_style_guide/in_text_citations_the_basics.html
- Purdue OWL, APA 7 author categories:
  https://owl.purdue.edu/owl/research_and_citation/apa_style/apa_formatting_and_style_guide/in_text_citations_author_authors.html

The official APA Style web pages were attempted first, but the site returned an
Incapsula block in this environment. Purdue OWL was used as the accessible APA 7
implementation reference for this pass.

## Findings

Open APA Desk already matched the common APA 7 parenthetical forms for:

- one author: `(Garcia, 2021)`
- two authors: `(Smith & Jones, 2020)`
- three or more authors: `(Williams et al., 2019)`
- missing dates: `(Open Education Lab, n.d.)`

Two gaps were found and fixed:

- no-author citations now use the title in the citation instead of
  `Unknown author`
- direct-quote citation insertion now supports an optional locator such as
  `p. 23`, `pp. 23-24`, or `para. 4`

The reference formatter also now moves a no-author title into the reference
author position instead of rendering `Unknown author`.

## Remaining Citation Limitations

V0 still does not support:

- narrative citation generation
- multiple works in one parenthetical citation
- same-author same-year `a`/`b` disambiguation
- same-surname initial disambiguation
- automatic quote detection
- automatic page/paragraph lookup

Users remain responsible for checking instructor, institution, and APA
requirements before submission.
