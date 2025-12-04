/**
 * Property-based tests for Archetype Correlator
 */

import * as fc from 'fast-check';
import { correlateArchetype } from './correlator';
import { MonsterCatalog } from './catalog';
import { WeightedTraits } from './types';

describe('Archetype Correlator', () => {
  /**
   * Feature: monster-matchmaker, Property 4: Correlation evaluates complete catalog
   * Validates: Requirements 2.1
   */
  describe('Property 4: Correlation evaluates complete catalog', () => {
    test('correlation evaluates all 15 monsters from the catalog', () => {
      // Generator for valid weighted traits
      const weightedTraitGen = fc.record({
        value: fc.string({ minLength: 1 }),
        weight: fc.constantFrom(1.0, 2.0)
      });

      const weightedTraitsGen = fc.record({
        timeOfDay: weightedTraitGen,
        weather: weightedTraitGen,
        conflictStyle: weightedTraitGen,
        snackFlavor: weightedTraitGen,
        ambition: weightedTraitGen
      });

      fc.assert(
        fc.property(weightedTraitsGen, (weightedTraits: WeightedTraits) => {
          const catalog = new MonsterCatalog();
          
          // Spy on catalog.getAll() to verify it's called
          const getAllSpy = jest.spyOn(catalog, 'getAll');
          
          // Call the correlator
          const result = correlateArchetype(weightedTraits, catalog);
          
          // Verify catalog.getAll() was called (meaning all monsters were evaluated)
          expect(getAllSpy).toHaveBeenCalled();
          
          // Verify the catalog has exactly 15 monsters
          const allMonsters = catalog.getAll();
          expect(allMonsters.length).toBe(15);
          
          // Verify the result is one of the 15 monsters
          const monsterNames = allMonsters.map(m => m.name);
          expect(monsterNames).toContain(result.name);
          
          getAllSpy.mockRestore();
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('correlation considers all catalog entries even with empty trait matches', () => {
      // Use traits that are unlikely to match any monster keywords
      const weightedTraitsGen = fc.record({
        timeOfDay: fc.constant({ value: 'zzz-nonexistent-time', weight: 1.0 }),
        weather: fc.constant({ value: 'zzz-nonexistent-weather', weight: 1.0 }),
        conflictStyle: fc.constant({ value: 'zzz-nonexistent-conflict', weight: 2.0 }),
        snackFlavor: fc.constant({ value: 'zzz-nonexistent-snack', weight: 1.0 }),
        ambition: fc.constant({ value: 'zzz-nonexistent-ambition', weight: 2.0 })
      });

      fc.assert(
        fc.property(weightedTraitsGen, (weightedTraits: WeightedTraits) => {
          const catalog = new MonsterCatalog();
          
          // Even with no matches, should still evaluate all monsters and return one
          const result = correlateArchetype(weightedTraits, catalog);
          
          // Should still return a valid monster from the catalog
          expect(result).toBeDefined();
          expect(result.name).toBeTruthy();
          
          const allMonsters = catalog.getAll();
          const monsterNames = allMonsters.map(m => m.name);
          expect(monsterNames).toContain(result.name);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: monster-matchmaker, Property 5: Assignment returns exactly one monster
   * Validates: Requirements 2.3
   */
  describe('Property 5: Assignment returns exactly one monster', () => {
    test('correlation always returns exactly one monster for any valid input', () => {
      // Generator for valid weighted traits
      const weightedTraitGen = fc.record({
        value: fc.string({ minLength: 1 }),
        weight: fc.constantFrom(1.0, 2.0)
      });

      const weightedTraitsGen = fc.record({
        timeOfDay: weightedTraitGen,
        weather: weightedTraitGen,
        conflictStyle: weightedTraitGen,
        snackFlavor: weightedTraitGen,
        ambition: weightedTraitGen
      });

      fc.assert(
        fc.property(weightedTraitsGen, (weightedTraits: WeightedTraits) => {
          const catalog = new MonsterCatalog();
          
          // Call the correlator
          const result = correlateArchetype(weightedTraits, catalog);
          
          // Verify exactly one monster is returned
          expect(result).toBeDefined();
          expect(result).not.toBeNull();
          
          // Verify the result is a valid MonsterPersona
          expect(result).toHaveProperty('name');
          expect(result).toHaveProperty('traits');
          expect(result).toHaveProperty('traitSummary');
          expect(typeof result.name).toBe('string');
          expect(result.name.length).toBeGreaterThan(0);
          expect(Array.isArray(result.traits)).toBe(true);
          expect(typeof result.traitSummary).toBe('string');
          
          // Verify the returned monster is from the catalog
          const catalogMonsters = catalog.getAll();
          const monsterNames = catalogMonsters.map(m => m.name);
          expect(monsterNames).toContain(result.name);
          
          // Verify we got exactly one monster (not an array or multiple)
          expect(result).not.toBeInstanceOf(Array);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('correlation returns consistent results for identical inputs', () => {
      const weightedTraitGen = fc.record({
        value: fc.string({ minLength: 1 }),
        weight: fc.constantFrom(1.0, 2.0)
      });

      const weightedTraitsGen = fc.record({
        timeOfDay: weightedTraitGen,
        weather: weightedTraitGen,
        conflictStyle: weightedTraitGen,
        snackFlavor: weightedTraitGen,
        ambition: weightedTraitGen
      });

      fc.assert(
        fc.property(weightedTraitsGen, (weightedTraits: WeightedTraits) => {
          const catalog = new MonsterCatalog();
          
          // Call the correlator multiple times with the same input
          const result1 = correlateArchetype(weightedTraits, catalog);
          const result2 = correlateArchetype(weightedTraits, catalog);
          const result3 = correlateArchetype(weightedTraits, catalog);
          
          // All results should be the same monster
          expect(result1.name).toBe(result2.name);
          expect(result1.name).toBe(result3.name);
          expect(result1.traitSummary).toBe(result2.traitSummary);
          expect(result1.traitSummary).toBe(result3.traitSummary);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: monster-matchmaker, Property 6: Trait summary matches catalog
   * Validates: Requirements 2.4
   */
  describe('Property 6: Trait summary matches catalog', () => {
    test('assigned monster trait summary exactly matches catalog definition', () => {
      // Generator for valid weighted traits
      const weightedTraitGen = fc.record({
        value: fc.string({ minLength: 1 }),
        weight: fc.constantFrom(1.0, 2.0)
      });

      const weightedTraitsGen = fc.record({
        timeOfDay: weightedTraitGen,
        weather: weightedTraitGen,
        conflictStyle: weightedTraitGen,
        snackFlavor: weightedTraitGen,
        ambition: weightedTraitGen
      });

      fc.assert(
        fc.property(weightedTraitsGen, (weightedTraits: WeightedTraits) => {
          const catalog = new MonsterCatalog();
          
          // Call the correlator
          const result = correlateArchetype(weightedTraits, catalog);
          
          // Get the same monster from the catalog
          const catalogMonster = catalog.getByName(result.name);
          
          // Verify the catalog monster exists
          expect(catalogMonster).not.toBeNull();
          
          if (catalogMonster) {
            // Verify the trait summary matches exactly
            expect(result.traitSummary).toBe(catalogMonster.traitSummary);
            
            // Verify the traits array matches exactly
            expect(result.traits).toEqual(catalogMonster.traits);
            expect(result.traits.length).toBe(catalogMonster.traits.length);
            
            // Verify each trait matches
            result.traits.forEach((trait, index) => {
              expect(trait).toBe(catalogMonster.traits[index]);
            });
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('trait summary is never modified from catalog original', () => {
      const weightedTraitGen = fc.record({
        value: fc.string({ minLength: 1 }),
        weight: fc.constantFrom(1.0, 2.0)
      });

      const weightedTraitsGen = fc.record({
        timeOfDay: weightedTraitGen,
        weather: weightedTraitGen,
        conflictStyle: weightedTraitGen,
        snackFlavor: weightedTraitGen,
        ambition: weightedTraitGen
      });

      fc.assert(
        fc.property(weightedTraitsGen, (weightedTraits: WeightedTraits) => {
          const catalog = new MonsterCatalog();
          
          // Get all monsters from catalog before correlation
          const allMonstersBefore = catalog.getAll();
          const monsterMapBefore = new Map(
            allMonstersBefore.map(m => [m.name, m.traitSummary])
          );
          
          // Call the correlator
          const result = correlateArchetype(weightedTraits, catalog);
          
          // Get all monsters from catalog after correlation
          const allMonstersAfter = catalog.getAll();
          const monsterMapAfter = new Map(
            allMonstersAfter.map(m => [m.name, m.traitSummary])
          );
          
          // Verify the catalog hasn't been modified
          expect(monsterMapBefore.size).toBe(monsterMapAfter.size);
          
          monsterMapBefore.forEach((traitSummary, name) => {
            expect(monsterMapAfter.get(name)).toBe(traitSummary);
          });
          
          // Verify the returned monster's trait summary matches the catalog
          expect(result.traitSummary).toBe(monsterMapAfter.get(result.name));
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
