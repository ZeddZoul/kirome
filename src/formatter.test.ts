/**
 * Property-based tests for output formatter
 */

import * as fc from 'fast-check';
import { formatOutput } from './formatter';
import { MonsterPersona } from './types';

// Generator for valid monster personas
const monsterPersonaGen = fc.record({
  name: fc.string({ minLength: 1 }),
  traits: fc.array(fc.string({ minLength: 1 }), { minLength: 5, maxLength: 5 }),
  traitSummary: fc.string({ minLength: 1 })
});

// Generator for rationale strings
const rationaleGen = fc.string({ minLength: 1 });

// Generator for image prompts
const imagePromptGen = fc.string({ minLength: 1 });

describe('Output Formatter', () => {
  /**
   * Feature: monster-matchmaker, Property 8: Output is valid minified JSON
   * Validates: Requirements 3.1, 3.5
   */
  test('Property 8: Output is valid minified JSON', () => {
    fc.assert(
      fc.property(
        monsterPersonaGen,
        rationaleGen,
        imagePromptGen,
        (monster, rationale, imagePrompt) => {
          const output = formatOutput(monster, rationale, imagePrompt);

          // Test 1: Output should be parseable as valid JSON
          let parsed;
          expect(() => {
            parsed = JSON.parse(output);
          }).not.toThrow();

          // Test 2: Output should have no leading or trailing whitespace
          expect(output).toBe(output.trim());

          // Test 3: Output should be minified (no unnecessary whitespace)
          // Check that there are no spaces after colons or commas (except in string values)
          // The minified JSON should not contain ": " or ", " patterns outside of strings
          const reMinified = JSON.stringify(JSON.parse(output));
          expect(output).toBe(reMinified);

          // Test 4: No text before or after JSON
          // The output should start with { and end with }
          expect(output.startsWith('{')).toBe(true);
          expect(output.endsWith('}')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: monster-matchmaker, Property 9: JSON structure is complete
   * Validates: Requirements 3.2, 3.4
   */
  test('Property 9: JSON structure is complete', () => {
    fc.assert(
      fc.property(
        monsterPersonaGen,
        rationaleGen,
        imagePromptGen,
        (monster, rationale, imagePrompt) => {
          const output = formatOutput(monster, rationale, imagePrompt);
          const parsed = JSON.parse(output);

          // Test 1: Root level should have assignment_result object
          expect(parsed).toHaveProperty('assignment_result');
          expect(typeof parsed.assignment_result).toBe('object');

          // Test 2: assignment_result should have assigned_persona field
          expect(parsed.assignment_result).toHaveProperty('assigned_persona');
          expect(parsed.assignment_result.assigned_persona).toBe(monster.name);

          // Test 3: assignment_result should have rationale field
          expect(parsed.assignment_result).toHaveProperty('rationale');
          expect(parsed.assignment_result.rationale).toBe(rationale);

          // Test 4: assignment_result should have core_trait_summary field
          expect(parsed.assignment_result).toHaveProperty('core_trait_summary');
          expect(parsed.assignment_result.core_trait_summary).toBe(monster.traitSummary);

          // Test 5: Root level should have image_generation_prompt field
          expect(parsed).toHaveProperty('image_generation_prompt');
          expect(parsed.image_generation_prompt).toBe(imagePrompt);

          // Test 6: Verify no extra fields at root level
          const rootKeys = Object.keys(parsed);
          expect(rootKeys.sort()).toEqual(['assignment_result', 'image_generation_prompt'].sort());

          // Test 7: Verify no extra fields in assignment_result
          const assignmentKeys = Object.keys(parsed.assignment_result);
          expect(assignmentKeys.sort()).toEqual(['assigned_persona', 'rationale', 'core_trait_summary'].sort());
        }
      ),
      { numRuns: 100 }
    );
  });
});
