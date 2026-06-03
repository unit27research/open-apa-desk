import {
  deleteReference,
  getDoiSetupStatus,
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
import { createApaStarterDocument } from './app/templateActions';
import type { ApaReference, PaperProfile } from './core/types';
import type { CitationMode } from './core/apa';

export function onOpen(): void {
  DocumentApp.getUi()
    .createMenu('Open APA Desk')
    .addItem('Open Sidebar', 'showOpenApaDeskSidebar')
    .addItem('Create APA Starter Doc', 'createApaStarterDocumentFromMenu')
    .addItem('Setup APA Paper', 'showOpenApaDeskSidebar')
    .addItem('Page Number Help', 'showPageNumberHelp')
    .addItem('Check DOI Setup', 'showDoiSetupStatus')
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
      'APA 7 student papers require page numbers in the top-right header, starting with 1 on the title page.',
      '',
      'Open APA Desk does not fake static page numbers.',
      '',
      'Use an Open APA Desk APA starter template or a document that already contains Google Docs dynamic page numbers before final submission.'
    ].join('\n'),
    DocumentApp.getUi().ButtonSet.OK
  );
}

export function createApaStarterDocumentFromMenu(): void {
  try {
    const result = createApaStarterDocument();
    const html = HtmlService.createHtmlOutput(
      [
        '<div style="font:14px Arial,sans-serif;line-height:1.5;padding:12px;">',
        '<h2 style="font-size:18px;margin:0 0 8px;">APA starter document created</h2>',
        `<p>${escapeHtml(result.message)}</p>`,
        `<p><a href="${escapeHtml(result.url)}" target="_blank" rel="noopener">${escapeHtml(result.linkLabel)}</a></p>`,
        '<p>Confirm page number 1 appears in the title-page header before final submission.</p>',
        '</div>'
      ].join('')
    )
      .setWidth(420)
      .setHeight(220);
    DocumentApp.getUi().showModalDialog(html, 'Open APA Desk');
  } catch (error) {
    DocumentApp.getUi().alert(
      'Open APA Desk starter document',
      error instanceof Error ? error.message : String(error),
      DocumentApp.getUi().ButtonSet.OK
    );
  }
}

export function showDoiSetupStatus(): void {
  const status = getDoiSetupStatus();
  DocumentApp.getUi().alert(
    'Open APA Desk DOI setup',
    status.message,
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

export function apiGetDoiSetupStatus() {
  return getDoiSetupStatus();
}

export function apiCreateApaStarterDocument() {
  return createApaStarterDocument();
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
