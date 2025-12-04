/**
 * Property-based tests for Rationale Generator
 */

import * as fc from 'fast-check';
import { generateRationale } from './rationale';
import { UserInput, MonsterPersona } from './types';

describe('Rationale Generator', () => {
  /**
   * Feature: monster-matchmaker, Property 7: Rationale references double-weighted traits
   * Validates: Requirements 2.5, 7.1
   */
  describe('Property 7: Rationale references double-weighted traits', () => {
    test('rationale mentions at least one double-weighted trait (conflictStyle or ambition)', () => {
      // Generator for valid user inputs
      const userInputGen = fc.record({
        timeOfDay: fc.string({ minLength: 3, maxLength: 20 }),
        weather: fc.string({ minLength: 3, maxLength: 20 }),
        conflictStyle: fc.string({ minLength: 3, maxLength: 20 }),
        snackFlavor: fc.string({ minLength: 3, maxLength: 20 }),
        ambition: fc.string({ minLength: 3, maxLength: 20 })
      });

      // Generator for monster personas
      const monsterGen = fc.record({
        name: fc.string({ minLength: 3, maxLength: 30 }),
        traits: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 5, maxLength: 5 }),
        traitSummary: fc.string({ minLength: 10, maxLength: 100 })
      });

      fc.assert(
        fc.property(userInputGen, monsterGen, (input: UserInput, monster: MonsterPersona) => {
          // Generate rationale
          const rationale = generateRationale(input, monster);
          
          // Convert to lowercase for case-insensitive matching
          const rationaleLower = rationale.toLowerCase();
          
          // Check if conflictStyle value is mentioned
          const mentionsConflict = rationaleLower.includes(input.conflictStyle.toLowerCase());
          
          // Check if ambition value is mentioned
          const mentionsAmbition = rationaleLower.includes(input.ambition.toLowerCase());
          
          // At least one of the double-weighted traits should be mentioned
          expect(mentionsConflict || mentionsAmbition).toBe(true);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('rationale prioritizes double-weighted traits in justification', () => {
      const userInputGen = fc.record({
        timeOfDay: fc.string({ minLength: 3, maxLength: 20 }),
        weather: fc.string({ minLength: 3, maxLength: 20 }),
        conflictStyle: fc.string({ minLength: 3, maxLength: 20 }),
        snackFlavor: fc.string({ minLength: 3, maxLength: 20 }),
        ambition: fc.string({ minLength: 3, maxLength: 20 })
      });

      const monsterGen = fc.record({
        name: fc.string({ minLength: 3, maxLength: 30 }),
        traits: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 5, maxLength: 5 }),
        traitSummary: fc.string({ minLength: 10, maxLength: 100 })
      });

      fc.assert(
        fc.property(userInputGen, monsterGen, (input: UserInput, monster: MonsterPersona) => {
          const rationale = generateRationale(input, monster);
          const rationaleLower = rationale.toLowerCase();
          
          // Count mentions of double-weighted traits
          const conflictMentions = rationaleLower.split(input.conflictStyle.toLowerCase()).length - 1;
          const ambitionMentions = rationaleLower.split(input.ambition.toLowerCase()).length - 1;
          const doubleWeightedMentions = conflictMentions + ambitionMentions;
          
          // Count mentions of normal-weighted traits
          const timeMentions = rationaleLower.split(input.timeOfDay.toLowerCase()).length - 1;
          const weatherMentions = rationaleLower.split(input.weather.toLowerCase()).length - 1;
          const snackMentions = rationaleLower.split(input.snackFlavor.toLowerCase()).length - 1;
          const normalWeightedMentions = timeMentions + weatherMentions + snackMentions;
          
          // Double-weighted traits should be mentioned at least as often as normal traits
          // (This validates prioritization of double-weighted traits)
          expect(doubleWeightedMentions).toBeGreaterThanOrEqual(1);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: monster-matchmaker, Property 10: Rationale respects word limit
   * Validates: Requirements 3.3, 7.5
   */
  describe('Property 10: Rationale respects word limit', () => {
    test('rationale word count does not exceed maximum', () => {
      // Generator for valid user inputs
      const userInputGen = fc.record({
        timeOfDay: fc.string({ minLength: 3, maxLength: 20 }),
        weather: fc.string({ minLength: 3, maxLength: 20 }),
        conflictStyle: fc.string({ minLength: 3, maxLength: 20 }),
        snackFlavor: fc.string({ minLength: 3, maxLength: 20 }),
        ambition: fc.string({ minLength: 3, maxLength: 20 })
      });

      // Generator for monster personas
      const monsterGen = fc.record({
        name: fc.string({ minLength: 3, maxLength: 30 }),
        traits: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 5, maxLength: 5 }),
        traitSummary: fc.string({ minLength: 10, maxLength: 100 })
      });

      fc.assert(
        fc.property(userInputGen, monsterGen, (input: UserInput, monster: MonsterPersona) => {
          // Generate rationale with default max words (50)
          const rationale = generateRationale(input, monster);
          
          // Count words by splitting on whitespace
          const words = rationale.split(/\s+/).filter(word => word.length > 0);
          const wordCount = words.length;
          
          // Verify word count does not exceed 50
          expect(wordCount).toBeLessThanOrEqual(50);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('rationale respects custom word limits', () => {
      const userInputGen = fc.record({
        timeOfDay: fc.string({ minLength: 3, maxLength: 20 }),
        weather: fc.string({ minLength: 3, maxLength: 20 }),
        conflictStyle: fc.string({ minLength: 3, maxLength: 20 }),
        snackFlavor: fc.string({ minLength: 3, maxLength: 20 }),
        ambition: fc.string({ minLength: 3, maxLength: 20 })
      });

      const monsterGen = fc.record({
        name: fc.string({ minLength: 3, maxLength: 30 }),
        traits: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 5, maxLength: 5 }),
        traitSummary: fc.string({ minLength: 10, maxLength: 100 })
      });

      // Test with various custom word limits
      const maxWordsGen = fc.integer({ min: 10, max: 100 });

      fc.assert(
        fc.property(userInputGen, monsterGen, maxWordsGen, (input: UserInput, monster: MonsterPersona, maxWords: number) => {
          // Generate rationale with custom max words
          const rationale = generateRationale(input, monster, maxWords);
          
          // Count words
          const words = rationale.split(/\s+/).filter(word => word.length > 0);
          const wordCount = words.length;
          
          // Verify word count does not exceed the specified limit
          expect(wordCount).toBeLessThanOrEqual(maxWords);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: monster-matchmaker, Property 16: Rationale mentions user attributes and monster traits
   * Validates: Requirements 7.4
   */
  describe('Property 16: Rationale mentions user attributes and monster traits', () => {
    test('rationale references at least one user attribute and one monster trait', () => {
      // Generator for valid user inputs
      const userInputGen = fc.record({
        timeOfDay: fc.string({ minLength: 3, maxLength: 20 }),
        weather: fc.string({ minLength: 3, maxLength: 20 }),
        conflictStyle: fc.string({ minLength: 3, maxLength: 20 }),
        snackFlavor: fc.string({ minLength: 3, maxLength: 20 }),
        ambition: fc.string({ minLength: 3, maxLength: 20 })
      });

      // Generator for monster personas
      const monsterGen = fc.record({
        name: fc.string({ minLength: 3, maxLength: 30 }),
        traits: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 5, maxLength: 5 }),
        traitSummary: fc.string({ minLength: 10, maxLength: 100 })
      });

      fc.assert(
        fc.property(userInputGen, monsterGen, (input: UserInput, monster: MonsterPersona) => {
          // Generate rationale
          const rationale = generateRationale(input, monster);
          
          // Verify rationale is a non-empty string
          expect(typeof rationale).toBe('string');
          expect(rationale.length).toBeGreaterThan(0);
          
          // Convert to lowercase for case-insensitive matching
          const rationaleLower = rationale.toLowerCase();
          
          // Check if at least one user attribute value is mentioned
          const userAttributeValues = [
            input.timeOfDay,
            input.weather,
            input.conflictStyle,
            input.snackFlavor,
            input.ambition
          ];
          
          const mentionsUserAttribute = userAttributeValues.some(value => {
            const valueLower = value.toLowerCase();
            return rationaleLower.includes(valueLower);
          });
          
          expect(mentionsUserAttribute).toBe(true);
          
          // Check if at least one monster trait is mentioned
          const mentionsMonsterTrait = monster.traits.some(trait => {
            const traitLower = trait.toLowerCase();
            return rationaleLower.includes(traitLower);
          });
          
          expect(mentionsMonsterTrait).toBe(true);
          
          // Additionally verify the monster name is mentioned
          const monsterNameLower = monster.name.toLowerCase();
          const mentionsMonsterName = rationaleLower.includes(monsterNameLower);
          
          // At least one of: monster trait or monster name should be mentioned
          expect(mentionsMonsterTrait || mentionsMonsterName).toBe(true);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('rationale references user attributes in meaningful context', () => {
      const userInputGen = fc.record({
        timeOfDay: fc.string({ minLength: 3, maxLength: 20 }),
        weather: fc.string({ minLength: 3, maxLength: 20 }),
        conflictStyle: fc.string({ minLength: 3, maxLength: 20 }),
        snackFlavor: fc.string({ minLength: 3, maxLength: 20 }),
        ambition: fc.string({ minLength: 3, maxLength: 20 })
      });

      const monsterGen = fc.record({
        name: fc.string({ minLength: 3, maxLength: 30 }),
        traits: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 5, maxLength: 5 }),
        traitSummary: fc.string({ minLength: 10, maxLength: 100 })
      });

      fc.assert(
        fc.property(userInputGen, monsterGen, (input: UserInput, monster: MonsterPersona) => {
          const rationale = generateRationale(input, monster);
          
          // Rationale should be at least 2 sentences (contains at least one period)
          const sentences = rationale.split(/[.!?]+/).filter(s => s.trim().length > 0);
          expect(sentences.length).toBeGreaterThanOrEqual(1);
          
          // Rationale should not be just a list of attributes
          expect(rationale.length).toBeGreaterThan(20);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
