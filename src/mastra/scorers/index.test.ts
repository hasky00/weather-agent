import { describe, it, expect } from 'vitest';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer, scorers } from './index';

describe('scorers', () => {
  it('exports toolCallAppropriatenessScorer', () => {
    expect(toolCallAppropriatenessScorer).toBeDefined();
  });

  it('exports completenessScorer', () => {
    expect(completenessScorer).toBeDefined();
  });

  it('exports translationScorer with correct id', () => {
    expect(translationScorer).toBeDefined();
    expect(translationScorer.id).toBe('translation-quality');
    expect(translationScorer.name).toBe('Translation Quality');
  });

  it('exports scorers object with all three scorers', () => {
    expect(scorers).toEqual({
      toolCallAppropriatenessScorer,
      completenessScorer,
      translationScorer,
    });
  });
});
