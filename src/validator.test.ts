/**
 * Property-based tests for input validation
 */

import * as fc from 'fast-check';
import { validateInput } from './validator';
import { UserInput } from './types';

describe('Input Validator', () => {
  /**
   * Feature: monster-matchmaker, Property 1: Input validation requires exactly five attributes
   * Validates: Requirements 1.1, 1.2
   */
  test('Property 1: Input validation requires exactly five attributes', () => {
    fc.assert(
      fc.property(
        fc.record({
          timeOfDay: fc.string(),
          weather: fc.string(),
          conflictStyle: fc.string(),
          snackFlavor: fc.string(),
          ambition: fc.string()
        }),
        fc.array(fc.tuple(fc.string(), fc.string()), { minLength: 0, maxLength: 10 }),
        (validInput, extraFields) => {
          // Test 1: Valid input with exactly 5 attributes should pass
          const validResult = validateInput(validInput);
          if (extraFields.length === 0) {
            expect(validResult.success).toBe(true);
          }

          // Test 2: Input with fewer than 5 attributes should fail
          const keys = Object.keys(validInput) as (keyof UserInput)[];
          if (keys.length > 0) {
            const partialInput: Partial<UserInput> = {};
            // Take only first 1-4 attributes
            const numToTake = Math.min(keys.length - 1, 4);
            for (let i = 0; i < numToTake; i++) {
              partialInput[keys[i]] = validInput[keys[i]];
            }
            if (Object.keys(partialInput).length < 5 && Object.keys(partialInput).length > 0) {
              const partialResult = validateInput(partialInput);
              expect(partialResult.success).toBe(false);
            }
          }

          // Test 3: Input with more than 5 attributes should fail
          if (extraFields.length > 0) {
            const extraInput: any = { ...validInput };
            extraFields.forEach(([key, value]) => {
              if (!['timeOfDay', 'weather', 'conflictStyle', 'snackFlavor', 'ambition'].includes(key)) {
                extraInput[key] = value;
              }
            });
            if (Object.keys(extraInput).length > 5) {
              const extraResult = validateInput(extraInput);
              expect(extraResult.success).toBe(false);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: monster-matchmaker, Property 3: Invalid inputs are rejected
   * Validates: Requirements 1.5
   */
  test('Property 3: Invalid inputs are rejected', () => {
    // Generator for invalid inputs
    const invalidInputGen = fc.oneof(
      // Missing attributes (0-4 attributes)
      fc.record(
        {
          timeOfDay: fc.option(fc.string(), { nil: undefined }),
          weather: fc.option(fc.string(), { nil: undefined }),
          conflictStyle: fc.option(fc.string(), { nil: undefined }),
          snackFlavor: fc.option(fc.string(), { nil: undefined }),
          ambition: fc.option(fc.string(), { nil: undefined })
        },
        { requiredKeys: [] }
      ).filter(obj => {
        const definedKeys = Object.keys(obj).filter(k => obj[k as keyof typeof obj] !== undefined);
        return definedKeys.length < 5;
      }),
      // Null values
      fc.record({
        timeOfDay: fc.constantFrom(null as any, undefined as any),
        weather: fc.string(),
        conflictStyle: fc.string(),
        snackFlavor: fc.string(),
        ambition: fc.string()
      }),
      // Undefined values
      fc.record({
        timeOfDay: fc.string(),
        weather: fc.constantFrom(null as any, undefined as any),
        conflictStyle: fc.string(),
        snackFlavor: fc.string(),
        ambition: fc.string()
      }),
      // Null input
      fc.constant(null as any),
      // Undefined input
      fc.constant(undefined as any)
    );

    fc.assert(
      fc.property(invalidInputGen, (invalidInput) => {
        const result = validateInput(invalidInput);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });
});
