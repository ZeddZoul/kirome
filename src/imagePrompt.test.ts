/**
 * Property-based tests for Image Prompt Builder
 */

import * as fc from 'fast-check';
import { buildImagePrompt } from './imagePrompt';
import { MonsterCatalog } from './catalog';

describe('Image Prompt Builder', () => {
  // Feature: monster-matchmaker, Property 11: Image prompt contains required elements
  // Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
  describe('Property 11: Image prompt contains required elements', () => {
    test('generated image prompt includes all required elements', () => {
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
            const monster = catalog.getByName(monsterName);
            
            expect(monster).not.toBeNull();
            
            if (monster) {
              const prompt = buildImagePrompt(monster);
              
              // 4.1: Source image reference
              expect(prompt.toLowerCase()).toMatch(/source image|transform/i);
              
              // Monster name should be included
              expect(prompt).toContain(monster.name);
              
              // 4.2: Neon-gothic horror aesthetic style
              expect(prompt.toLowerCase()).toMatch(/neon-gothic|gothic/i);
              expect(prompt.toLowerCase()).toContain('horror');
              
              // 4.3: Electric violet color code #8E48FF
              expect(prompt).toContain('#8E48FF');
              expect(prompt.toLowerCase()).toMatch(/violet|electric/i);
              
              // 4.4: Foggy city street background
              expect(prompt.toLowerCase()).toContain('foggy');
              expect(prompt.toLowerCase()).toContain('city');
              expect(prompt.toLowerCase()).toContain('street');
              
              // 4.5: Technical quality descriptors
              expect(prompt.toLowerCase()).toContain('photorealistic');
              expect(prompt.toLowerCase()).toContain('8k');
              expect(prompt.toLowerCase()).toMatch(/cinematic|volumetric/i);
              expect(prompt.toLowerCase()).toContain('lighting');
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
