import type { TemplateCopyResult } from '../core/types';
import {
  buildGoogleDocsEditUrl,
  buildGoogleDocsTemplateCopyUrl
} from '../core/templateLinks';

const TEMPLATE_DOC_ID_PROPERTY = 'OPEN_APA_TEMPLATE_DOC_ID';
const DRIVE_COPY_FIELDS = 'id,name,webViewLink';

export function createApaStarterDocument(): TemplateCopyResult {
  const templateId = requireTemplateDocumentId();
  const name = buildStarterDocumentName();
  const response = UrlFetchApp.fetch(buildDriveCopyUrl(templateId), {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${ScriptApp.getOAuthToken()}`
    },
    payload: JSON.stringify({ name }),
    muteHttpExceptions: true
  });

  const status = response.getResponseCode();
  const responseText = response.getContentText();
  if (status < 200 || status >= 300) {
    return buildManualCopyFallback(templateId, name, status);
  }

  const result = JSON.parse(responseText) as Partial<TemplateCopyResult>;
  if (!result.id) {
    throw new Error('APA starter template copy did not return a document ID.');
  }

  return {
    id: result.id,
    name: result.name || name,
    url: result.url || result.webViewLink || buildGoogleDocsEditUrl(result.id),
    message:
      'APA starter document created. Open it, confirm dynamic page numbers, then continue setup in that document.',
    creationMode: 'driveCopy',
    linkLabel: 'Open starter document'
  };
}

function buildManualCopyFallback(
  templateId: string,
  name: string,
  status: number
): TemplateCopyResult {
  return {
    name,
    url: buildGoogleDocsTemplateCopyUrl(templateId, name),
    message:
      `Automatic template copy was blocked by Google Drive status ${status}. Open Google's copy page to create the APA starter document with dynamic page numbers.`,
    creationMode: 'manualTemplateCopy',
    linkLabel: 'Open copy page'
  };
}

function requireTemplateDocumentId(): string {
  const templateId = PropertiesService.getScriptProperties()
    .getProperty(TEMPLATE_DOC_ID_PROPERTY)
    ?.trim();
  if (!templateId) {
    throw new Error(
      `Set ${TEMPLATE_DOC_ID_PROPERTY} in Apps Script project settings before creating APA starter documents.`
    );
  }
  return templateId;
}

function buildStarterDocumentName(): string {
  const date = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd');
  return `Open APA Desk APA Paper - ${date}`;
}

function buildDriveCopyUrl(templateId: string): string {
  const encodedTemplateId = encodeURIComponent(templateId);
  const params = [
    'supportsAllDrives=true',
    `fields=${encodeURIComponent(DRIVE_COPY_FIELDS)}`
  ].join('&');
  return `https://www.googleapis.com/drive/v3/files/${encodedTemplateId}/copy?${params}`;
}
