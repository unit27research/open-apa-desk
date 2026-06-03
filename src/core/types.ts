export type SourceType =
  | 'journalArticle'
  | 'book'
  | 'bookChapter'
  | 'website'
  | 'report';

export interface ApaAuthor {
  family: string;
  given?: string | undefined;
}

export interface ApaReference {
  id: string;
  sourceType: SourceType;
  authors: ApaAuthor[];
  year?: string | undefined;
  title: string;
  containerTitle?: string | undefined;
  siteName?: string | undefined;
  publisher?: string | undefined;
  volume?: string | undefined;
  issue?: string | undefined;
  pages?: string | undefined;
  doi?: string | undefined;
  url?: string | undefined;
}

export interface PaperProfile {
  title: string;
  author: string;
  institution?: string | undefined;
  course?: string | undefined;
  instructor?: string | undefined;
  dueDate?: string | undefined;
  paperType?: 'student' | 'professional' | undefined;
}

export interface CitationRecord {
  id: string;
  referenceIds: string[];
  insertedText: string;
  createdAt: string;
}

export interface DocumentState {
  schemaVersion: number;
  paperProfile?: PaperProfile | undefined;
  references: ApaReference[];
  citations: CitationRecord[];
  generatedSectionIds: Record<string, string>;
}

export interface TemplateCopyResult {
  id?: string | undefined;
  name: string;
  url: string;
  webViewLink?: string | undefined;
  creationMode: 'driveCopy' | 'manualTemplateCopy';
  linkLabel: string;
  message: string;
}
