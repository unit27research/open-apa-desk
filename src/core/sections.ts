export type ControlledSection = 'title' | 'body' | 'references';
export type MarkerPosition = 'start' | 'end';

const MARKER_PATTERN = /^\[\[OPEN_APA_DESK:[A-Z_]+:(START|END)\]\]$/;

export function markerFor(
  section: ControlledSection,
  position: MarkerPosition
): string {
  return `[[OPEN_APA_DESK:${section.toUpperCase()}:${position.toUpperCase()}]]`;
}

export function buildControlledSectionLines(
  section: ControlledSection,
  lines: string[]
): string[] {
  return [markerFor(section, 'start'), ...lines, markerFor(section, 'end')];
}

export function isControlMarker(value: string): boolean {
  return MARKER_PATTERN.test(value.trim());
}

export function stripControlMarkers(lines: string[]): string[] {
  return lines.filter((line) => !isControlMarker(line));
}
