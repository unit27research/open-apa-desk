import {
  APA_DOCUMENT_STYLE,
  buildBodyStartEntries,
  buildCitationTextStyle,
  buildTitlePageEntries,
  normalizePaperProfile
} from '../src/core/documentFormat';
import type { PaperProfile } from '../src/core/types';

describe('APA document setup formatting helpers', () => {
  it('defines the visible APA baseline used by controlled paper setup', () => {
    expect(APA_DOCUMENT_STYLE).toMatchObject({
      fontFamily: 'Times New Roman',
      fontSize: 12,
      lineSpacing: 2,
      margins: {
        top: 72,
        right: 72,
        bottom: 72,
        left: 72
      }
    });
  });

  it('builds student title page entries in the order APA setup renders them', () => {
    const profile: PaperProfile = {
      title: 'Trust Signals in Student Writing Tools',
      author: 'Jordan Miller',
      institution: 'University of Tennessee at Chattanooga',
      course: 'EDUC 5000',
      instructor: 'Dr. Example',
      dueDate: 'May 31, 2026'
    };

    expect(buildTitlePageEntries(profile)).toEqual([
      { role: 'title', text: 'Trust Signals in Student Writing Tools' },
      { role: 'author', text: 'Jordan Miller' },
      {
        role: 'institution',
        text: 'University of Tennessee at Chattanooga'
      },
      { role: 'course', text: 'EDUC 5000' },
      { role: 'instructor', text: 'Dr. Example' },
      { role: 'dueDate', text: 'May 31, 2026' }
    ]);
  });

  it('builds the controlled body starter from the paper title', () => {
    expect(
      buildBodyStartEntries({
        title: 'Trust Signals in Student Writing Tools',
        author: 'Jordan Miller'
      })
    ).toEqual([
      { role: 'title', text: 'Trust Signals in Student Writing Tools' }
    ]);
  });

  it('builds visible APA styling for inserted citation text', () => {
    expect(buildCitationTextStyle()).toEqual({
      fontFamily: 'Times New Roman',
      fontSize: 12,
      foregroundColor: '#000000',
      bold: false,
      italic: false
    });
  });

  it('omits blank optional title page entries', () => {
    expect(
      buildTitlePageEntries({
        title: 'A Paper',
        author: 'A. Student',
        institution: '   '
      })
    ).toEqual([
      { role: 'title', text: 'A Paper' },
      { role: 'author', text: 'A. Student' }
    ]);
  });

  it('normalizes required paper profile fields before document setup', () => {
    expect(
      normalizePaperProfile({
        title: '  A Paper  ',
        author: '  A. Student  ',
        institution: '  UTC  '
      })
    ).toEqual({
      title: 'A Paper',
      author: 'A. Student',
      institution: 'UTC',
      paperType: 'student'
    });
  });

  it('rejects setup without a title or author', () => {
    expect(() =>
      normalizePaperProfile({
        title: '',
        author: 'A. Student'
      })
    ).toThrow('Paper title is required.');

    expect(() =>
      normalizePaperProfile({
        title: 'A Paper',
        author: '   '
      })
    ).toThrow('Paper author is required.');
  });
});
