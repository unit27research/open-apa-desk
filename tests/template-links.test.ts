import {
  buildGoogleDocsEditUrl,
  buildGoogleDocsTemplateCopyUrl
} from '../src/core/templateLinks';

describe('template links', () => {
  it('builds a Google Docs copy URL for the configured APA template', () => {
    const url = buildGoogleDocsTemplateCopyUrl(
      'template doc/id',
      'Open APA Desk APA Paper - 2026-06-02'
    );

    expect(url).toBe(
      'https://docs.google.com/document/d/template%20doc%2Fid/copy?copyComments=false&title=Open%20APA%20Desk%20APA%20Paper%20-%202026-06-02'
    );
  });

  it('builds a Google Docs edit URL for a copied starter document', () => {
    expect(buildGoogleDocsEditUrl('copied doc/id')).toBe(
      'https://docs.google.com/document/d/copied%20doc%2Fid/edit'
    );
  });
});
