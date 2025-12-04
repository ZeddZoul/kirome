/**
 * Rationale Generator - Creates humorous justification for monster assignments
 */

import { UserInput, MonsterPersona } from './types';

/**
 * Generates a humorous rationale linking user traits to assigned monster
 * 
 * @param input - User's original input attributes
 * @param monster - Assigned monster persona
 * @param maxWords - Maximum word count (default 50)
 * @returns Rationale string (2-3 sentences)
 * 
 * Requirements: 2.5, 7.1, 7.4, 7.5
 */
export function generateRationale(
  input: UserInput,
  monster: MonsterPersona,
  maxWords: number = 50
): string {
  // Build rationale that references double-weighted traits (conflict and ambition)
  // and monster traits with creative, humorous language
  
  const templates = [
    // Template 1: Focus on conflict and ambition with monster traits
    () => `Your ${input.conflictStyle} approach to conflict and ${input.ambition} ambition scream ${monster.traits[0]}. ` +
          `Like the ${monster.name}, you're ${monster.traits[1]} and ${monster.traits[2]} to your core. ` +
          `Welcome to your monstrous destiny!`,
    
    // Template 2: Emphasize double-weighted traits with humor
    () => `That ${input.conflictStyle} conflict style paired with ${input.ambition} ambition? Pure ${monster.name} energy. ` +
          `You've got that ${monster.traits[0]} vibe with a dash of ${monster.traits[3]}. ` +
          `The transformation is inevitable.`,
    
    // Template 3: Creative connection between traits
    () => `Your ${input.ambition} ambition and ${input.conflictStyle} conflict resolution reveal your ${monster.traits[0]} essence. ` +
          `The ${monster.name} recognizes a kindred spirit—${monster.traits[1]}, ${monster.traits[2]}, and utterly ${monster.traits[4]}.`,
    
    // Template 4: Playful tone with double-weighted focus
    () => `Between your ${input.conflictStyle} conflict style and ${input.ambition} ambitions, you're basically already a ${monster.name}. ` +
          `That ${monster.traits[0]} and ${monster.traits[1]} nature? Chef's kiss. ` +
          `Embrace the ${monster.traits[2]} within.`,
    
    // Template 5: Direct and humorous
    () => `Your ${input.ambition} ambition combined with ${input.conflictStyle} conflict handling makes you undeniably ${monster.traits[0]}. ` +
          `The ${monster.name} sees itself in your ${monster.traits[1]} and ${monster.traits[3]} tendencies. ` +
          `This match was written in the stars.`
  ];
  
  // Select template based on monster name (deterministic)
  const templateIndex = monster.name.length % templates.length;
  const rationale = templates[templateIndex]();
  
  // Ensure word limit is respected
  const words = rationale.split(/\s+/).filter(w => w.length > 0);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ');
  }
  
  return rationale;
}
