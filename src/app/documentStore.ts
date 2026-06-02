import { buildDefaultState } from '../core/state';
import type { DocumentState } from '../core/types';

const STATE_KEY = 'openApaDesk.documentState';

export function loadDocumentState(): DocumentState {
  const properties = PropertiesService.getDocumentProperties();
  const rawState = properties.getProperty(STATE_KEY);
  if (!rawState) {
    return buildDefaultState();
  }

  try {
    return {
      ...buildDefaultState(),
      ...JSON.parse(rawState)
    } as DocumentState;
  } catch (_error) {
    return buildDefaultState();
  }
}

export function saveDocumentState(state: DocumentState): DocumentState {
  PropertiesService.getDocumentProperties().setProperty(
    STATE_KEY,
    JSON.stringify(state)
  );
  return state;
}
