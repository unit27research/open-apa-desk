import { formatReference, sortReferences } from './apa';
import type { ApaReference, DocumentState } from './types';

export const SCHEMA_VERSION = 1;

export function buildDefaultState(): DocumentState {
  return {
    schemaVersion: SCHEMA_VERSION,
    references: [],
    citations: [],
    generatedSectionIds: {}
  };
}

export function upsertReference(
  state: DocumentState,
  reference: ApaReference
): DocumentState {
  const existingIndex = state.references.findIndex((item) => item.id === reference.id);
  const duplicate = existingIndex >= 0 ? undefined : findDuplicateReference(state, reference);
  const targetIndex =
    existingIndex >= 0
      ? existingIndex
      : duplicate
        ? state.references.findIndex((item) => item.id === duplicate.id)
        : -1;
  const references = [...state.references];
  if (targetIndex >= 0) {
    references[targetIndex] = {
      ...reference,
      id: references[targetIndex]?.id ?? reference.id
    };
  } else {
    references.push(reference);
  }
  return {
    ...state,
    references
  };
}

export function findDuplicateReference(
  state: DocumentState,
  reference: ApaReference
): ApaReference | undefined {
  const incomingDoi = normalizeDoiForDuplicate(reference.doi);
  if (incomingDoi) {
    return state.references.find((item) => {
      return (
        item.id !== reference.id &&
        normalizeDoiForDuplicate(item.doi) === incomingDoi
      );
    });
  }

  const incomingManualKey = buildManualDuplicateKey(reference);
  if (!incomingManualKey) {
    return undefined;
  }

  return state.references.find((item) => {
    return item.id !== reference.id && buildManualDuplicateKey(item) === incomingManualKey;
  });
}

export function deleteReference(
  state: DocumentState,
  referenceId: string
): DocumentState {
  return {
    ...state,
    references: state.references.filter((reference) => reference.id !== referenceId)
  };
}

export function addCitation(
  state: DocumentState,
  referenceIds: string[],
  insertedText: string
): DocumentState {
  return {
    ...state,
    citations: [
      ...state.citations,
      {
        id: createCitationId(),
        referenceIds,
        insertedText,
        createdAt: new Date().toISOString()
      }
    ]
  };
}

export function buildReferencesSectionText(state: DocumentState): string {
  const renderedReferences = sortReferences(state.references).map(formatReference);
  return ['References', ...renderedReferences].join('\n\n');
}

function createCitationId(): string {
  return `cite_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeDoiForDuplicate(doi: string | undefined): string {
  return (doi ?? '')
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
    .toLowerCase();
}

function buildManualDuplicateKey(reference: ApaReference): string {
  const title = normalizeManualKeyPart(reference.title);
  if (!title) {
    return '';
  }
  return [
    reference.sourceType,
    title,
    normalizeManualKeyPart(reference.year ?? ''),
    normalizeManualKeyPart(reference.authors[0]?.family ?? '')
  ].join('|');
}

function normalizeManualKeyPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,:;!?]+$/g, '');
}
