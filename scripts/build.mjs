import { copyFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('dist', { recursive: true });

await build({
  entryPoints: ['src/apps-script.ts'],
  bundle: true,
  outfile: 'dist/Code.js',
  format: 'iife',
  target: 'es2020',
  platform: 'neutral',
  globalName: 'OpenAPADeskBundle',
  footer: {
    js: `
function onOpen(e) { return OpenAPADeskBundle.onOpen(e); }
function onInstall(e) { return OpenAPADeskBundle.onInstall(e); }
function showOpenApaDeskSidebar() { return OpenAPADeskBundle.showOpenApaDeskSidebar(); }
function showPageNumberHelp() { return OpenAPADeskBundle.showPageNumberHelp(); }
function rebuildReferences() { return OpenAPADeskBundle.apiRebuildReferences(); }
function prepareCurrentCopyForSubmission() { return OpenAPADeskBundle.apiPrepareCurrentCopyForSubmission(); }
function apiGetState() { return OpenAPADeskBundle.apiGetState(); }
function apiSetupPaper(profile) { return OpenAPADeskBundle.apiSetupPaper(profile); }
function apiSaveReference(reference) { return OpenAPADeskBundle.apiSaveReference(reference); }
function apiDeleteReference(referenceId) { return OpenAPADeskBundle.apiDeleteReference(referenceId); }
function apiGetReferences() { return OpenAPADeskBundle.apiGetReferences(); }
function apiLookupDoi(doi) { return OpenAPADeskBundle.apiLookupDoi(doi); }
function apiInsertCitation(referenceId, locator, mode) { return OpenAPADeskBundle.apiInsertCitation(referenceId, locator, mode); }
function apiInsertCitationGroup(referenceIds, locator) { return OpenAPADeskBundle.apiInsertCitationGroup(referenceIds, locator); }
function apiRebuildReferences() { return OpenAPADeskBundle.apiRebuildReferences(); }
function apiPrepareCurrentCopyForSubmission() { return OpenAPADeskBundle.apiPrepareCurrentCopyForSubmission(); }
`
  }
});

await copyFile('src/Sidebar.html', 'dist/Sidebar.html');
await copyFile('src/appsscript.json', 'dist/appsscript.json');
