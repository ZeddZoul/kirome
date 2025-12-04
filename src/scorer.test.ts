/**
 * Property-based tests for trait scorer
 */

import * as fc from 'fast-check';
import { scoreTraits } from './scorer';
import { UserInput } from './types';

describe('Trait Scorer', () => {
  /**
   * Feature: monster-matchmaker, Property 2: Attribute weighting follows specification
   * Validates: Requirements 1.3, 1.4
   */
  test('Property 2: Attribute weighting follows specification', () => {
    // Generator for valid user inputs
    const validInputGen = fc.record({
      timeOfDay: fc.string(),
      weather: fc.string(),
      conflictStyle: fc.string(),
      snackFlavor: fc.string(),
      ambition: fc.string()
    });

    fc.assert(
      fc.property(validInputGen, (input: UserInput) => {
        const weightedTraits = scoreTraits(input);

        // Verify normal weight (1.0) for timeOfDay, weather, snackFlavor
        expect(weightedTraits.timeOfDay.weight).toBe(1.0);
        expect(weightedTraits.timeOfDay.value).toBe(input.timeOfDay);

        expect(weightedTraits.weather.weight).toBe(1.0);
        expect(weightedTraits.weather.value).toBe(input.weather);

        expect(weightedTraits.snackFlavor.weight).toBe(1.0);
        expect(weightedTraits.snackFlavor.value).toBe(input.snackFlavor);

        // Verify double weight (2.0) for conflictStyle, ambition
        expect(weightedTraits.conflictStyle.weight).toBe(2.0);
        expect(weightedTraits.conflictStyle.value).toBe(input.conflictStyle);

        expect(weightedTraits.ambition.weight).toBe(2.0);
        expect(weightedTraits.ambition.value).toBe(input.ambition);
      }),
      { numRuns: 100 }
    );
  });
});
