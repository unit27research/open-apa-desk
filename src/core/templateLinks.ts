export function buildGoogleDocsTemplateCopyUrl(
  templateDocumentId: string,
  title: string
): string {
  const documentId = encodeURIComponent(templateDocumentId);
  const params = [
    'copyComments=false',
    `title=${encodeURIComponent(title)}`
  ].join('&');
  return `https://docs.google.com/document/d/${documentId}/copy?${params}`;
}

export function buildGoogleDocsEditUrl(documentId: string): string {
  return `https://docs.google.com/document/d/${encodeURIComponent(documentId)}/edit`;
}
