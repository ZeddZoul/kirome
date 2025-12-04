/**
 * Property-based tests for Monster Catalog
 */

import * as fc from 'fast-check';
import { MonsterCatalog } from './catalog';

describe('MonsterCatalog', () => {
  // Feature: monster-matchmaker, Property 12: Catalog contains exactly 15 monsters
  // Validates: Requirements 5.1, 5.3
  describe('Property 12: Catalog contains exactly 15 monsters', () => {
    test('catalog always contains exactly 15 monster personas with specified names', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const catalog = new MonsterCatalog();
          const monsters = catalog.getAll();
          
          // Check that we have exactly 15 monsters
          expect(monsters.length).toBe(15);
          
          // Check that all required monster names are present
          const expectedNames = [
            'Vampire',
            'Werewolf',
            'Cthulhu',
            "Frankenstein's Monster",
            'Mummy',
            'Zombie',
            'Banshee',
            'Witch',
            'Headless Horseman',
            'Cryptid',
            'Grim Reaper',
            'Poltergeist',
            'Demogorgon',
            'Alien Parasite',
            'Gorgon'
          ];
          
          const actualNames = monsters.map(m => m.name).sort();
          const sortedExpectedNames = [...expectedNames].sort();
          
          expect(actualNames).toEqual(sortedExpectedNames);
          
          // Verify each monster has the required structure
          monsters.forEach(monster => {
            expect(monster).toHaveProperty('name');
            expect(monster).toHaveProperty('traits');
            expect(monster).toHaveProperty('traitSummary');
            expect(typeof monster.name).toBe('string');
            expect(Array.isArray(monster.traits)).toBe(true);
            expect(typeof monster.traitSummary).toBe('string');
          });
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: monster-matchmaker, Property 13: Trait summaries respect word limit
  // Validates: Requirements 5.2
  describe('Property 13: Trait summaries respect word limit', () => {
    test('all monster trait summaries contain at most 5 words', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const catalog = new MonsterCatalog();
          const monsters = catalog.getAll();
          
          monsters.forEach(monster => {
            // Check traits array has exactly 5 elements
            expect(monster.traits.length).toBe(5);
            
            // Each trait should be a single word (no spaces)
            monster.traits.forEach(trait => {
              expect(typeof trait).toBe('string');
              expect(trait.length).toBeGreaterThan(0);
            });
            
            // Verify traitSummary matches the traits array
            const expectedSummary = monster.traits.join(', ');
            expect(monster.traitSummary).toBe(expectedSummary);
          });
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: monster-matchmaker, Property 14: Catalog maintains data integrity
  // Validates: Requirements 5.4, 5.5
  describe('Property 14: Catalog maintains data integrity', () => {
    test('retrieving monsters multiple times returns identical data', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'Vampire',
            'Werewolf',
            'Cthulhu',
            "Frankenstein's Monster",
            'Mummy',
            'Zombie',
            'Banshee',
            'Witch',
            'Headless Horseman',
            'Cryptid',
            'Grim Reaper',
            'Poltergeist',
            'Demogorgon',
            'Alien Parasite',
            'Gorgon'
          ),
          (monsterName) => {
            const catalog = new MonsterCatalog();
            
            // Retrieve the same monster multiple times
            const first = catalog.getByName(monsterName);
            const second = catalog.getByName(monsterName);
            const third = catalog.getByName(monsterName);
            
            // All retrievals should return non-null
            expect(first).not.toBeNull();
            expect(second).not.toBeNull();
            expect(third).not.toBeNull();
            
            if (first && second && third) {
              // All retrievals should have identical data
              expect(first.name).toBe(second.name);
              expect(first.name).toBe(third.name);
              
              expect(first.traitSummary).toBe(second.traitSummary);
              expect(first.traitSummary).toBe(third.traitSummary);
              
              expect(first.traits).toEqual(second.traits);
              expect(first.traits).toEqual(third.traits);
              
              // Verify that modifying returned data doesn't affect subsequent retrievals
              first.traits.push('modified');
              const fourth = catalog.getByName(monsterName);
              expect(fourth).not.toBeNull();
              if (fourth) {
                expect(fourth.traits.length).toBe(5);
                expect(fourth.traits).not.toContain('modified');
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('getAll returns consistent data across multiple calls', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const catalog = new MonsterCatalog();
          
          const first = catalog.getAll();
          const second = catalog.getAll();
          
          // Both calls should return the same number of monsters
          expect(first.length).toBe(second.length);
          expect(first.length).toBe(15);
          
          // Each monster should have identical data
          for (let i = 0; i < first.length; i++) {
            expect(first[i].name).toBe(second[i].name);
            expect(first[i].traitSummary).toBe(second[i].traitSummary);
            expect(first[i].traits).toEqual(second[i].traits);
          }
          
          // Verify that modifying returned data doesn't affect subsequent calls
          first[0].traits.push('modified');
          const third = catalog.getAll();
          expect(third[0].traits.length).toBe(5);
          expect(third[0].traits).not.toContain('modified');
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
