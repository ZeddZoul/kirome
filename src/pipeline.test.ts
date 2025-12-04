/**
 * Property-based tests for Processing Pipeline
 */

import * as fc from 'fast-check';
import { processPipeline } from './pipeline';
import { UserInput } from './types';
import { MonsterCatalog } from './catalog';

describe('Pipeline Property Tests', () => {
  /**
   * Feature: monster-matchmaker, Property 15: Pipeline executes in correct order
   * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5
   * 
   * For any input, the system should execute stages in strict sequence:
   * validation → weighting → correlation → finalization → JSON generation,
   * with any failure halting the pipeline immediately.
   */
  it('should execute pipeline stages in correct order and halt on errors', () => {
    fc.assert(
      fc.property(
        // Generator for various input types including valid and invalid
        fc.oneof(
          // Valid inputs
          fc.record({
            timeOfDay: fc.string({ minLength: 1, maxLength: 20 }),
            weather: fc.string({ minLength: 1, maxLength: 20 }),
            conflictStyle: fc.string({ minLength: 1, maxLength: 20 }),
            snackFlavor: fc.string({ minLength: 1, maxLength: 20 }),
            ambition: fc.string({ minLength: 1, maxLength: 20 })
          }),
          // Invalid inputs - missing attributes
          fc.record({
            timeOfDay: fc.string({ minLength: 1, maxLength: 20 }),
            weather: fc.string({ minLength: 1, maxLength: 20 })
          }),
          // Invalid inputs - extra attributes
          fc.record({
            timeOfDay: fc.string({ minLength: 1, maxLength: 20 }),
            weather: fc.string({ minLength: 1, maxLength: 20 }),
            conflictStyle: fc.string({ minLength: 1, maxLength: 20 }),
            snackFlavor: fc.string({ minLength: 1, maxLength: 20 }),
            ambition: fc.string({ minLength: 1, maxLength: 20 }),
            extra: fc.string({ minLength: 1, maxLength: 20 })
          }),
          // Invalid inputs - null/undefined values
          fc.record({
            timeOfDay: fc.constant(null),
            weather: fc.string({ minLength: 1, maxLength: 20 }),
            conflictStyle: fc.string({ minLength: 1, maxLength: 20 }),
            snackFlavor: fc.string({ minLength: 1, maxLength: 20 }),
            ambition: fc.string({ minLength: 1, maxLength: 20 })
          })
        ),
        (input) => {
          const catalog = new MonsterCatalog();
          const result = processPipeline(input as Partial<UserInput>, catalog);

          // Property 1: Result should always be a Result type (success or failure)
          expect(result).toHaveProperty('success');
          expect(typeof result.success).toBe('boolean');

          if (result.success) {
            // Property 2: Successful results should have a value
            expect(result).toHaveProperty('value');
            expect(typeof result.value).toBe('string');

            // Property 3: Successful results mean all stages executed
            // The output should be valid JSON
            expect(() => JSON.parse(result.value)).not.toThrow();

            const parsed = JSON.parse(result.value);
            
            // Property 4: Output should have the complete structure (all stages completed)
            expect(parsed).toHaveProperty('assignment_result');
            expect(parsed.assignment_result).toHaveProperty('assigned_persona');
            expect(parsed.assignment_result).toHaveProperty('rationale');
            expect(parsed.assignment_result).toHaveProperty('core_trait_summary');
            expect(parsed).toHaveProperty('image_generation_prompt');
          } else {
            // Property 5: Failed results should have an error message
            expect(result).toHaveProperty('error');
            expect(typeof result.error).toBe('string');
            expect(result.error.length).toBeGreaterThan(0);

            // Property 6: Error messages should indicate which stage failed
            // This demonstrates fail-fast behavior
            const errorMessage = result.error.toLowerCase();
            const stageIndicators = [
              'validation',
              'trait scoring',
              'archetype correlation',
              'rationale generation',
              'image prompt generation',
              'output formatting'
            ];
            
            const hasStageIndicator = stageIndicators.some(stage => 
              errorMessage.includes(stage)
            );
            expect(hasStageIndicator).toBe(true);
          }

          // Property 7: Invalid inputs should fail at validation stage (first stage)
          const inputKeys = Object.keys(input);
          const hasNullValues = Object.values(input).some(v => v === null || v === undefined);
          
          if (inputKeys.length !== 5 || hasNullValues) {
            // Should fail at validation
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.toLowerCase()).toContain('validation');
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional test: Verify that valid inputs always succeed through all stages
   */
  it('should complete all stages successfully for valid inputs', () => {
    fc.assert(
      fc.property(
        fc.record({
          timeOfDay: fc.string({ minLength: 1, maxLength: 20 }),
          weather: fc.string({ minLength: 1, maxLength: 20 }),
          conflictStyle: fc.string({ minLength: 1, maxLength: 20 }),
          snackFlavor: fc.string({ minLength: 1, maxLength: 20 }),
          ambition: fc.string({ minLength: 1, maxLength: 20 })
        }),
        (input) => {
          const catalog = new MonsterCatalog();
          const result = processPipeline(input, catalog);

          // Valid inputs should always succeed
          expect(result.success).toBe(true);

          if (result.success) {
            // Verify the output is valid JSON
            const parsed = JSON.parse(result.value);

            // Verify all stages completed by checking output structure
            expect(parsed.assignment_result.assigned_persona).toBeTruthy();
            expect(parsed.assignment_result.rationale).toBeTruthy();
            expect(parsed.assignment_result.core_trait_summary).toBeTruthy();
            expect(parsed.image_generation_prompt).toBeTruthy();

            // Verify the assigned persona is from the catalog
            const monster = catalog.getByName(parsed.assignment_result.assigned_persona);
            expect(monster).not.toBeNull();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
