import {
  deleteReference,
  getInitialSidebarState,
  getReferences,
  insertCitation,
  insertCitationGroup,
  lookupDoi,
  prepareCurrentCopyForSubmission,
  rebuildReferences,
  saveReference,
  setupApaPaper
} from './app/docsActions';
import type { ApaReference, PaperProfile } from './core/types';
import type { CitationMode } from './core/apa';

export function onOpen(): void {
  DocumentApp.getUi()
    .createMenu('Open APA Desk')
    .addItem('Open Sidebar', 'showOpenApaDeskSidebar')
    .addItem('Setup APA Paper', 'showOpenApaDeskSidebar')
    .addItem('Page Number Help', 'showPageNumberHelp')
    .addSeparator()
    .addItem('Rebuild References', 'rebuildReferences')
    .addItem('Prepare Current Copy', 'prepareCurrentCopyForSubmission')
    .addToUi();
}

export function onInstall(): void {
  onOpen();
}

export function showOpenApaDeskSidebar(): void {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Open APA Desk')
    .setWidth(420);
  DocumentApp.getUi().showSidebar(html);
}

export function showPageNumberHelp(): void {
  DocumentApp.getUi().alert(
    'Open APA Desk page numbers',
    [
      'Google Docs supports automatic page numbers, but Apps Script does not expose a reliable dynamic page-number insertion method.',
      '',
      'For now, use Insert > Page elements > Page numbers and choose the top-right page number option before submitting.',
      '',
      'Open APA Desk keeps the rest of setup controlled so it does not fake static page numbers.'
    ].join('\n'),
    DocumentApp.getUi().ButtonSet.OK
  );
}

export function apiGetState() {
  return getInitialSidebarState();
}

export function apiSetupPaper(profile: PaperProfile) {
  return setupApaPaper(profile);
}

export function apiSaveReference(reference: ApaReference) {
  return saveReference(reference);
}

export function apiDeleteReference(referenceId: string) {
  return deleteReference(referenceId);
}

export function apiGetReferences() {
  return getReferences();
}

export function apiLookupDoi(doi: string) {
  return lookupDoi(doi);
}

export function apiInsertCitation(
  referenceId: string,
  locator?: string,
  mode?: CitationMode
) {
  return insertCitation(referenceId, locator, mode);
}

export function apiInsertCitationGroup(referenceIds: string[], locator?: string) {
  return insertCitationGroup(referenceIds, locator);
}

export function apiRebuildReferences() {
  return rebuildReferences();
}

export function apiPrepareCurrentCopyForSubmission() {
  return prepareCurrentCopyForSubmission();
}
