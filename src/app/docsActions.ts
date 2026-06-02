import {
  formatCitationByMode,
  formatCitationGroup,
  type CitationMode
} from '../core/apa';
import {
  buildCrossrefUserAgent,
  buildCrossrefWorksUrl,
  getCrossrefMailtoStatus,
  normalizeCrossrefWork,
  normalizeDoi,
  requireCrossrefMailto
} from '../core/crossref';
import {
  APA_DOCUMENT_STYLE,
  buildBodyStartEntries,
  buildTitlePageEntries,
  normalizePaperProfile,
  type BodyStartEntry,
  type TitlePageEntry
} from '../core/documentFormat';
import {
  addCitation,
  buildDefaultState,
  buildReferencesSectionText,
  deleteReference as deleteReferenceFromState,
  findDuplicateReference,
  upsertReference
} from '../core/state';
import { isControlMarker, markerFor, type ControlledSection } from '../core/sections';
import type { ApaReference, DocumentState, PaperProfile } from '../core/types';
import { loadDocumentState, saveDocumentState } from './documentStore';

const REFERENCES_HEADING = 'References';
const APP_VERSION = '0.1.0-alpha.0';

export function setupApaPaper(profile: PaperProfile): DocumentState {
  const document = DocumentApp.getActiveDocument();
  const body = document.getBody();
  const normalizedProfile = normalizePaperProfile(profile);
  const state = {
    ...loadDocumentState(),
    paperProfile: normalizedProfile
  };

  applyApaDocumentBaseline(document);
  removeControlledSection(body, 'body');
  removeControlledSection(body, 'title');
  const nextIndex = insertTitlePageSectionAtTop(
    body,
    buildTitlePageEntries(normalizedProfile)
  );
  insertBodyStartSection(body, nextIndex, buildBodyStartEntries(normalizedProfile));

  return saveDocumentState({
    ...state,
    generatedSectionIds: {
      ...state.generatedSectionIds,
      title: markerFor('title', 'start'),
      body: markerFor('body', 'start')
    }
  });
}

export function saveReference(reference: ApaReference): DocumentState {
  let state = loadDocumentState();
  const duplicate = findDuplicateReference(state, reference);
  state = upsertReference(state, reference);
  const savedReferenceId = duplicate?.id ?? reference.id;
  const savedReference = state.references.find(
    (item) => item.id === savedReferenceId
  );
  if (!savedReference) {
    throw new Error('Unable to save reference.');
  }
  return saveDocumentState(state);
}

export function getReferences(): ApaReference[] {
  return loadDocumentState().references;
}

export function deleteReference(referenceId: string): DocumentState {
  const currentState = loadDocumentState();
  const state = deleteReferenceFromState(currentState, referenceId);
  return saveDocumentState(state);
}

export function insertCitation(
  referenceId: string,
  locator?: string | undefined,
  mode: CitationMode = 'parenthetical'
): DocumentState {
  const state = loadDocumentState();
  const reference = state.references.find((item) => item.id === referenceId);
  if (!reference) {
    throw new Error(`Reference not found: ${referenceId}`);
  }

  const citationText = formatCitationByMode(reference, mode, locator);
  insertTextAtCursor(citationText);

  return saveDocumentState(addCitation(state, [referenceId], citationText));
}

export function insertCitationGroup(
  referenceIds: string[],
  locator?: string | undefined
): DocumentState {
  const state = loadDocumentState();
  const uniqueReferenceIds = [...new Set(referenceIds.filter(Boolean))];
  if (uniqueReferenceIds.length === 0) {
    throw new Error('Choose at least one saved reference.');
  }

  const references = uniqueReferenceIds.map((referenceId) => {
    const reference = state.references.find((item) => item.id === referenceId);
    if (!reference) {
      throw new Error(`Reference not found: ${referenceId}`);
    }
    return reference;
  });

  const firstReference = references[0];
  const locators =
    references.length === 1 && firstReference && locator
      ? { [firstReference.id]: locator }
      : undefined;
  const citationText =
    references.length === 1
      ? formatCitationGroup(references, locators)
      : formatCitationGroup(references);
  insertTextAtCursor(citationText);

  return saveDocumentState(addCitation(state, uniqueReferenceIds, citationText));
}

function insertTextAtCursor(citationText: string): void {
  const cursor = DocumentApp.getActiveDocument().getCursor();
  if (!cursor) {
    throw new Error('Place your cursor where the citation should be inserted.');
  }

  const inserted = cursor.insertText(citationText);
  if (!inserted) {
    throw new Error('Unable to insert citation at the current cursor position.');
  }
}

export function rebuildReferences(): DocumentState {
  const body = DocumentApp.getActiveDocument().getBody();
  const state = loadDocumentState();
  removeControlledSection(body, 'references');

  const references = buildReferencesSectionText(state)
    .split('\n\n')
    .slice(1);
  appendHiddenMarker(body, markerFor('references', 'start'));
  body.appendPageBreak();
  styleReferencesHeading(body.appendParagraph(REFERENCES_HEADING));
  references.forEach((referenceText) => {
    styleReferenceParagraph(body.appendParagraph(referenceText));
  });
  appendHiddenMarker(body, markerFor('references', 'end'));

  return saveDocumentState({
    ...state,
    generatedSectionIds: {
      ...state.generatedSectionIds,
      references: markerFor('references', 'start')
    }
  });
}

export function prepareCurrentCopyForSubmission(): string {
  const document = DocumentApp.getActiveDocument();
  removeAllControlMarkers(document.getBody());
  return 'Open APA Desk markers removed from this document.';
}

export function lookupDoi(doiInput: string): ApaReference {
  const doi = normalizeDoi(doiInput);
  const mailto = requireCrossrefMailto(
    PropertiesService.getScriptProperties().getProperty('CROSSREF_MAILTO')
  );
  const url = buildCrossrefWorksUrl(doi, mailto);
  const response = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    headers: {
      'User-Agent': buildCrossrefUserAgent(APP_VERSION, mailto)
    }
  });
  const status = response.getResponseCode();
  if (status < 200 || status >= 300) {
    throw new Error(`Crossref lookup failed with status ${status}.`);
  }
  const payload = JSON.parse(response.getContentText()) as {
    message?: unknown;
  };
  if (!payload.message) {
    throw new Error('Crossref response did not include a work record.');
  }
  return normalizeCrossrefWork(payload.message);
}

export function getDoiSetupStatus() {
  return getCrossrefMailtoStatus(
    PropertiesService.getScriptProperties().getProperty('CROSSREF_MAILTO')
  );
}

export function getInitialSidebarState(): DocumentState {
  const state = loadDocumentState();
  if (state.schemaVersion) {
    return state;
  }
  return saveDocumentState(buildDefaultState());
}

function applyApaDocumentBaseline(
  document: GoogleAppsScript.Document.Document
): void {
  const body = document.getBody();
  body
    .setMarginTop(APA_DOCUMENT_STYLE.margins.top)
    .setMarginRight(APA_DOCUMENT_STYLE.margins.right)
    .setMarginBottom(APA_DOCUMENT_STYLE.margins.bottom)
    .setMarginLeft(APA_DOCUMENT_STYLE.margins.left);

  body.setHeadingAttributes(
    DocumentApp.ParagraphHeading.NORMAL,
    buildParagraphAttributes()
  );
}

function insertTitlePageSectionAtTop(
  body: GoogleAppsScript.Document.Body,
  entries: TitlePageEntry[]
): number {
  let index = 0;
  styleMarkerParagraph(body.insertParagraph(index, markerFor('title', 'start')));
  index += 1;

  for (
    let lineIndex = 0;
    lineIndex < APA_DOCUMENT_STYLE.titlePageTopBlankLines;
    lineIndex += 1
  ) {
    styleTitlePageParagraph(body.insertParagraph(index, ''));
    index += 1;
  }

  entries.forEach((entry) => {
    if (entry.role === 'author') {
      styleTitlePageParagraph(body.insertParagraph(index, ''));
      index += 1;
    }
    styleTitlePageParagraph(
      body.insertParagraph(index, entry.text),
      entry.role === 'title'
    );
    index += 1;
  });

  body.insertPageBreak(index);
  index += 1;
  styleMarkerParagraph(body.insertParagraph(index, markerFor('title', 'end')));
  return index + 1;
}

function insertBodyStartSection(
  body: GoogleAppsScript.Document.Body,
  initialIndex: number,
  entries: BodyStartEntry[]
): void {
  let index = initialIndex;
  styleMarkerParagraph(body.insertParagraph(index, markerFor('body', 'start')));
  index += 1;

  entries.forEach((entry) => {
    styleBodyStartParagraph(
      body.insertParagraph(index, entry.text),
      entry.role === 'title'
    );
    index += 1;
  });

  styleMarkerParagraph(body.insertParagraph(index, markerFor('body', 'end')));
}

function removeControlledSection(
  body: GoogleAppsScript.Document.Body,
  section: ControlledSection
): void {
  const startIndex = findParagraphIndex(body, markerFor(section, 'start'));
  const endIndex = findParagraphIndex(body, markerFor(section, 'end'));
  if (startIndex < 0 || endIndex < startIndex) {
    removeLooseControlledMarkers(body, section);
    return;
  }
  removeChildrenBetween(body, startIndex, endIndex);
}

function removeLooseControlledMarkers(
  body: GoogleAppsScript.Document.Body,
  section: ControlledSection
): void {
  const markers = new Set([
    markerFor(section, 'start'),
    markerFor(section, 'end')
  ]);
  for (let index = body.getNumChildren() - 1; index >= 0; index -= 1) {
    const child = body.getChild(index);
    if (
      child.getType() === DocumentApp.ElementType.PARAGRAPH &&
      markers.has(child.asParagraph().getText().trim())
    ) {
      removeBodyChildSafely(body, child);
    }
  }
}

function removeAllControlMarkers(body: GoogleAppsScript.Document.Body): void {
  for (let index = body.getNumChildren() - 1; index >= 0; index -= 1) {
    const child = body.getChild(index);
    if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      continue;
    }
    if (isControlMarker(child.asParagraph().getText())) {
      removeBodyChildSafely(body, child);
    }
  }
}

function findParagraphIndex(
  body: GoogleAppsScript.Document.Body,
  text: string
): number {
  for (let index = 0; index < body.getNumChildren(); index += 1) {
    const child = body.getChild(index);
    if (
      child.getType() === DocumentApp.ElementType.PARAGRAPH &&
      child.asParagraph().getText().trim() === text
    ) {
      return index;
    }
  }
  return -1;
}

function removeChildrenBetween(
  body: GoogleAppsScript.Document.Body,
  startIndex: number,
  endIndex: number
): void {
  if (endIndex === body.getNumChildren() - 1) {
    body.appendParagraph('');
  }
  for (let index = endIndex; index >= startIndex; index -= 1) {
    removeBodyChildSafely(body, body.getChild(index));
  }
}

function removeBodyChildSafely(
  body: GoogleAppsScript.Document.Body,
  child: GoogleAppsScript.Document.Element
): void {
  if (body.getChildIndex(child) === body.getNumChildren() - 1) {
    body.appendParagraph('');
  }
  body.removeChild(child);
}

function appendHiddenMarker(
  body: GoogleAppsScript.Document.Body,
  text: string
): void {
  styleMarkerParagraph(body.appendParagraph(text));
}

function styleReferencesHeading(
  paragraph: GoogleAppsScript.Document.Paragraph
): void {
  paragraph.setHeading(DocumentApp.ParagraphHeading.NORMAL);
  styleApaParagraph(paragraph)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
    .setIndentFirstLine(0)
    .setIndentStart(0);
  paragraph.editAsText().setBold(true);
}

function styleReferenceParagraph(
  paragraph: GoogleAppsScript.Document.Paragraph
): void {
  paragraph.setHeading(DocumentApp.ParagraphHeading.NORMAL);
  styleApaParagraph(paragraph)
    .setAlignment(DocumentApp.HorizontalAlignment.LEFT)
    .setIndentFirstLine(0)
    .setIndentStart(APA_DOCUMENT_STYLE.hangingIndent);
}

function styleTitlePageParagraph(
  paragraph: GoogleAppsScript.Document.Paragraph,
  bold = false
): void {
  paragraph.setHeading(DocumentApp.ParagraphHeading.NORMAL);
  styleApaParagraph(paragraph)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
    .setIndentFirstLine(0)
    .setIndentStart(0);
  paragraph.editAsText().setBold(bold);
}

function styleBodyStartParagraph(
  paragraph: GoogleAppsScript.Document.Paragraph,
  bold = false
): void {
  paragraph.setHeading(DocumentApp.ParagraphHeading.NORMAL);
  styleApaParagraph(paragraph)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
    .setIndentFirstLine(0)
    .setIndentStart(0);
  paragraph.editAsText().setBold(bold);
}

function styleApaParagraph(
  paragraph: GoogleAppsScript.Document.Paragraph
): GoogleAppsScript.Document.Paragraph {
  paragraph
    .setLineSpacing(APA_DOCUMENT_STYLE.lineSpacing)
    .setSpacingBefore(0)
    .setSpacingAfter(0);
  paragraph.editAsText().setAttributes(buildTextAttributes());
  return paragraph;
}

function styleMarkerParagraph(paragraph: GoogleAppsScript.Document.Paragraph): void {
  paragraph.setSpacingBefore(0).setSpacingAfter(0);
  paragraph.editAsText().setFontSize(1).setForegroundColor('#ffffff');
}

function buildTextAttributes(): Record<string, string | number | boolean> {
  return {
    [DocumentApp.Attribute.FONT_FAMILY]: APA_DOCUMENT_STYLE.fontFamily,
    [DocumentApp.Attribute.FONT_SIZE]: APA_DOCUMENT_STYLE.fontSize,
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#000000',
    [DocumentApp.Attribute.BOLD]: false,
    [DocumentApp.Attribute.ITALIC]: false
  };
}

function buildParagraphAttributes(): Record<string, string | number | boolean> {
  return {
    ...buildTextAttributes(),
    [DocumentApp.Attribute.LINE_SPACING]: APA_DOCUMENT_STYLE.lineSpacing
  };
}
