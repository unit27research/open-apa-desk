import type { PaperProfile } from './types';

export type TitlePageRole =
  | 'title'
  | 'author'
  | 'institution'
  | 'course'
  | 'instructor'
  | 'dueDate';
export type BodyStartRole = 'title';

export interface TitlePageEntry {
  role: TitlePageRole;
  text: string;
}

export interface BodyStartEntry {
  role: BodyStartRole;
  text: string;
}

export interface CitationTextStyle {
  fontFamily: string;
  fontSize: number;
  foregroundColor: string;
  bold: boolean;
  italic: boolean;
}

export const APA_DOCUMENT_STYLE = {
  fontFamily: 'Times New Roman',
  fontSize: 12,
  lineSpacing: 2,
  margins: {
    top: 72,
    right: 72,
    bottom: 72,
    left: 72
  },
  titlePageTopBlankLines: 3,
  hangingIndent: 36
} as const;

export function buildTitlePageEntries(profile: PaperProfile): TitlePageEntry[] {
  const entries: Array<{ role: TitlePageRole; text?: string | undefined }> = [
    { role: 'title', text: profile.title },
    { role: 'author', text: profile.author },
    { role: 'institution', text: profile.institution },
    { role: 'course', text: profile.course },
    { role: 'instructor', text: profile.instructor },
    { role: 'dueDate', text: profile.dueDate }
  ];

  return entries.flatMap((entry) => {
    const text = entry.text?.trim();
    return text ? [{ role: entry.role, text }] : [];
  });
}

export function buildBodyStartEntries(profile: PaperProfile): BodyStartEntry[] {
  const title = profile.title.trim();
  return title ? [{ role: 'title', text: title }] : [];
}

export function buildCitationTextStyle(): CitationTextStyle {
  return {
    fontFamily: APA_DOCUMENT_STYLE.fontFamily,
    fontSize: APA_DOCUMENT_STYLE.fontSize,
    foregroundColor: '#000000',
    bold: false,
    italic: false
  };
}

export function normalizePaperProfile(profile: PaperProfile): PaperProfile {
  const normalized: PaperProfile = {
    title: profile.title.trim(),
    author: profile.author.trim(),
    paperType: profile.paperType ?? 'student'
  };

  if (!normalized.title) {
    throw new Error('Paper title is required.');
  }
  if (!normalized.author) {
    throw new Error('Paper author is required.');
  }

  const institution = profile.institution?.trim();
  const course = profile.course?.trim();
  const instructor = profile.instructor?.trim();
  const dueDate = profile.dueDate?.trim();

  if (institution) {
    normalized.institution = institution;
  }
  if (course) {
    normalized.course = course;
  }
  if (instructor) {
    normalized.instructor = instructor;
  }
  if (dueDate) {
    normalized.dueDate = dueDate;
  }

  return normalized;
}
