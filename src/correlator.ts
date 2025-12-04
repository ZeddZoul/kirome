/**
 * Archetype Correlator - Matches user traits to monster personas
 */

import { WeightedTraits, MonsterPersona, CorrelationScore } from './types';
import { MonsterCatalog } from './catalog';

/**
 * Correlates user's weighted traits to the most conceptually adjacent monster
 * 
 * @param weightedTraits - User traits with applied weighting
 * @param catalog - Monster catalog to search
 * @returns The best-matching monster persona
 * 
 * Requirements: 2.1, 2.3
 */
export function correlateArchetype(
  weightedTraits: WeightedTraits,
  catalog: MonsterCatalog
): MonsterPersona {
  const monsters = catalog.getAll();
  
  if (monsters.length === 0) {
    throw new Error('Catalog is empty');
  }

  // Calculate correlation scores for all monsters
  const scores: CorrelationScore[] = monsters.map(monster => {
    const score = calculateCorrelationScore(weightedTraits, monster);
    return {
      monster,
      score,
      reasoning: []
    };
  });

  // Sort by score (descending), then by name (alphabetical) for deterministic tie-breaking
  scores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.monster.name.localeCompare(b.monster.name);
  });

  // Return the top-scoring monster
  return scores[0].monster;
}

/**
 * Calculate correlation score between weighted traits and a monster
 * 
 * @param weightedTraits - User traits with weights
 * @param monster - Monster persona to score against
 * @returns Correlation score
 */
function calculateCorrelationScore(
  weightedTraits: WeightedTraits,
  monster: MonsterPersona
): number {
  let score = 0;

  // Extract all trait values and their weights
  const traits = [
    { value: weightedTraits.timeOfDay.value, weight: weightedTraits.timeOfDay.weight },
    { value: weightedTraits.weather.value, weight: weightedTraits.weather.weight },
    { value: weightedTraits.conflictStyle.value, weight: weightedTraits.conflictStyle.weight },
    { value: weightedTraits.snackFlavor.value, weight: weightedTraits.snackFlavor.weight },
    { value: weightedTraits.ambition.value, weight: weightedTraits.ambition.weight }
  ];

  // Simple keyword matching with weight multipliers
  traits.forEach(trait => {
    const keywords = extractKeywords(trait.value);
    keywords.forEach(keyword => {
      monster.traits.forEach(monsterTrait => {
        if (semanticMatch(keyword, monsterTrait)) {
          score += trait.weight;
        }
      });
    });
  });

  return score;
}

/**
 * Extract keywords from a user input value
 * 
 * @param value - User input string
 * @returns Array of keywords
 */
function extractKeywords(value: string): string[] {
  return value.toLowerCase().split(/\s+/).filter(word => word.length > 0);
}

/**
 * Check if a keyword semantically matches a monster trait
 * 
 * @param keyword - User input keyword
 * @param trait - Monster trait
 * @returns True if there's a semantic match
 */
function semanticMatch(keyword: string, trait: string): boolean {
  // Simple substring matching for now
  const normalizedKeyword = keyword.toLowerCase();
  const normalizedTrait = trait.toLowerCase();
  
  return normalizedTrait.includes(normalizedKeyword) || 
         normalizedKeyword.includes(normalizedTrait);
}
