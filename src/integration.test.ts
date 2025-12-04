/**
 * Integration Tests - End-to-end flow testing
 * Tests complete pipeline with realistic user inputs
 */

import { main } from './cli';
import { UserInput, OutputJSON } from './types';

describe('Integration Tests - End-to-End Flow', () => {
  describe('Complete pipeline with realistic inputs', () => {
    test('should process valid input and return complete JSON output', () => {
      const input: UserInput = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: 'direct confrontation',
        snackFlavor: 'salty',
        ambition: 'power and control'
      };

      const output = main(input);
      
      // Verify output is valid JSON
      expect(() => JSON.parse(output)).not.toThrow();
      
      const parsed: OutputJSON = JSON.parse(output);
      
      // Verify structure
      expect(parsed).toHaveProperty('assignment_result');
      expect(parsed).toHaveProperty('image_generation_prompt');
      
      // Verify assignment_result fields
      expect(parsed.assignment_result).toHaveProperty('assigned_persona');
      expect(parsed.assignment_result).toHaveProperty('rationale');
      expect(parsed.assignment_result).toHaveProperty('core_trait_summary');
      
      // Verify types
      expect(typeof parsed.assignment_result.assigned_persona).toBe('string');
      expect(typeof parsed.assignment_result.rationale).toBe('string');
      expect(typeof parsed.assignment_result.core_trait_summary).toBe('string');
      expect(typeof parsed.image_generation_prompt).toBe('string');
      
      // Verify non-empty values
      expect(parsed.assignment_result.assigned_persona.length).toBeGreaterThan(0);
      expect(parsed.assignment_result.rationale.length).toBeGreaterThan(0);
      expect(parsed.assignment_result.core_trait_summary.length).toBeGreaterThan(0);
      expect(parsed.image_generation_prompt.length).toBeGreaterThan(0);
    });

    test('should handle nocturnal attributes appropriately', () => {
      const input: UserInput = {
        timeOfDay: 'midnight',
        weather: 'foggy',
        conflictStyle: 'avoidance',
        snackFlavor: 'sweet',
        ambition: 'immortality'
      };

      const output = main(input);
      const parsed: OutputJSON = JSON.parse(output);
      
      expect(parsed.assignment_result.assigned_persona).toBeTruthy();
      expect(parsed.assignment_result.rationale).toContain('avoidance');
      expect(parsed.assignment_result.rationale).toContain('immortality');
    });

    test('should handle chaotic attributes appropriately', () => {
      const input: UserInput = {
        timeOfDay: 'dusk',
        weather: 'wild thunderstorm',
        conflictStyle: 'explosive rage',
        snackFlavor: 'raw meat',
        ambition: 'freedom from constraints'
      };

      const output = main(input);
      const parsed: OutputJSON = JSON.parse(output);
      
      expect(parsed.assignment_result.assigned_persona).toBeTruthy();
      expect(parsed.assignment_result.rationale).toContain('explosive rage');
      expect(parsed.assignment_result.rationale).toContain('freedom from constraints');
    });
  });

  describe('Golden test cases - Known input-output pairs', () => {
    test('should consistently assign same monster for identical inputs', () => {
      const input: UserInput = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: 'direct',
        snackFlavor: 'salty',
        ambition: 'power'
      };

      const output1 = main(input);
      const output2 = main(input);
      
      // Determinism check - same input should produce same output
      expect(output1).toBe(output2);
    });

    test('should produce valid rationale within word limit', () => {
      const input: UserInput = {
        timeOfDay: 'dawn',
        weather: 'misty',
        conflictStyle: 'strategic planning',
        snackFlavor: 'bitter',
        ambition: 'knowledge and wisdom'
      };

      const output = main(input);
      const parsed: OutputJSON = JSON.parse(output);
      
      // Check word count
      const wordCount = parsed.assignment_result.rationale.split(/\s+/).length;
      expect(wordCount).toBeLessThanOrEqual(50);
      
      // Check references to double-weighted traits
      const rationale = parsed.assignment_result.rationale.toLowerCase();
      const hasConflictRef = rationale.includes('strategic') || rationale.includes('planning');
      const hasAmbitionRef = rationale.includes('knowledge') || rationale.includes('wisdom');
      
      expect(hasConflictRef || hasAmbitionRef).toBe(true);
    });

    test('should include all required elements in image prompt', () => {
      const input: UserInput = {
        timeOfDay: 'twilight',
        weather: 'eerie calm',
        conflictStyle: 'manipulation',
        snackFlavor: 'exotic',
        ambition: 'control others'
      };

      const output = main(input);
      const parsed: OutputJSON = JSON.parse(output);
      
      const prompt = parsed.image_generation_prompt.toLowerCase();
      
      // Check for required elements
      expect(prompt).toContain('neon-gothic');
      expect(prompt).toContain('#8e48ff');
      expect(prompt).toContain('foggy city street');
      expect(prompt).toContain('photorealistic');
      expect(prompt).toContain('8k');
      expect(prompt).toContain('cinematic');
    });
  });

  describe('Error scenarios with invalid inputs', () => {
    test('should return error JSON for missing attributes', () => {
      const input = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: 'direct'
        // Missing snackFlavor and ambition
      };

      const output = main(input);
      const parsed = JSON.parse(output);
      
      expect(parsed).toHaveProperty('error');
      expect(parsed.error).toContain('Validation failed');
    });

    test('should return error JSON for empty input', () => {
      const input = {};

      const output = main(input);
      const parsed = JSON.parse(output);
      
      expect(parsed).toHaveProperty('error');
      expect(parsed.error).toContain('Validation failed');
    });

    test('should return error JSON for extra attributes', () => {
      const input = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: 'direct',
        snackFlavor: 'salty',
        ambition: 'power',
        extraField: 'should not be here'
      };

      const output = main(input);
      const parsed = JSON.parse(output);
      
      expect(parsed).toHaveProperty('error');
      expect(parsed.error).toContain('Validation failed');
    });

    test('should return error JSON for null values', () => {
      const input = {
        timeOfDay: 'night',
        weather: null,
        conflictStyle: 'direct',
        snackFlavor: 'salty',
        ambition: 'power'
      } as any;

      const output = main(input);
      const parsed = JSON.parse(output);
      
      expect(parsed).toHaveProperty('error');
    });

    test('should return error JSON for undefined values', () => {
      const input = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: undefined,
        snackFlavor: 'salty',
        ambition: 'power'
      } as any;

      const output = main(input);
      const parsed = JSON.parse(output);
      
      expect(parsed).toHaveProperty('error');
    });
  });

  describe('Output format validation', () => {
    test('should produce minified JSON with no extra whitespace', () => {
      const input: UserInput = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: 'direct',
        snackFlavor: 'salty',
        ambition: 'power'
      };

      const output = main(input);
      
      // Check that output doesn't have pretty-printing
      expect(output).not.toContain('\n');
      expect(output).not.toMatch(/:\s{2,}/);
      
      // Verify it's still valid JSON
      expect(() => JSON.parse(output)).not.toThrow();
    });

    test('should have no text before or after JSON', () => {
      const input: UserInput = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: 'direct',
        snackFlavor: 'salty',
        ambition: 'power'
      };

      const output = main(input);
      
      // Should start with { and end with }
      expect(output.trim().startsWith('{')).toBe(true);
      expect(output.trim().endsWith('}')).toBe(true);
      
      // Should be parseable as-is
      expect(() => JSON.parse(output)).not.toThrow();
    });
  });

  describe('Determinism and consistency', () => {
    test('should produce identical output for multiple runs with same input', () => {
      const input: UserInput = {
        timeOfDay: 'afternoon',
        weather: 'sunny',
        conflictStyle: 'peaceful negotiation',
        snackFlavor: 'sweet',
        ambition: 'harmony'
      };

      const outputs = Array.from({ length: 5 }, () => main(input));
      
      // All outputs should be identical
      outputs.forEach(output => {
        expect(output).toBe(outputs[0]);
      });
    });

    test('should assign exactly one monster per input', () => {
      const inputs: UserInput[] = [
        {
          timeOfDay: 'morning',
          weather: 'clear',
          conflictStyle: 'avoidance',
          snackFlavor: 'bland',
          ambition: 'survival'
        },
        {
          timeOfDay: 'evening',
          weather: 'rainy',
          conflictStyle: 'aggressive',
          snackFlavor: 'spicy',
          ambition: 'domination'
        },
        {
          timeOfDay: 'noon',
          weather: 'overcast',
          conflictStyle: 'passive',
          snackFlavor: 'sour',
          ambition: 'peace'
        }
      ];

      inputs.forEach(input => {
        const output = main(input);
        const parsed: OutputJSON = JSON.parse(output);
        
        // Should have exactly one assigned persona
        expect(parsed.assignment_result.assigned_persona).toBeTruthy();
        expect(typeof parsed.assignment_result.assigned_persona).toBe('string');
        expect(parsed.assignment_result.assigned_persona.length).toBeGreaterThan(0);
      });
    });
  });
});
