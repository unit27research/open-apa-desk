import {
  buildControlledSectionLines,
  markerFor,
  stripControlMarkers
} from '../src/core/sections';

describe('controlled section helpers', () => {
  it('wraps generated content in stable section markers', () => {
    expect(buildControlledSectionLines('references', ['References', 'A reference.'])).toEqual([
      '[[OPEN_APA_DESK:REFERENCES:START]]',
      'References',
      'A reference.',
      '[[OPEN_APA_DESK:REFERENCES:END]]'
    ]);
  });

  it('creates predictable markers for generated sections', () => {
    expect(markerFor('title', 'start')).toBe('[[OPEN_APA_DESK:TITLE:START]]');
    expect(markerFor('title', 'end')).toBe('[[OPEN_APA_DESK:TITLE:END]]');
  });

  it('removes tool-only markers for clean-copy preparation', () => {
    expect(
      stripControlMarkers([
        'Intro',
        '[[OPEN_APA_DESK:REFERENCES:START]]',
        'References',
        '[[OPEN_APA_DESK:REFERENCES:END]]'
      ])
    ).toEqual(['Intro', 'References']);
  });
});
