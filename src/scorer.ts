/**
 * Trait Scorer - Applies weighting rules to user attributes
 */

import { UserInput, WeightedTraits } from './types';

/**
 * Applies weighting rules to user attributes
 * - Normal weight (1.0): timeOfDay, weather, snackFlavor
 * - Double weight (2.0): conflictStyle, ambition
 * 
 * @param input - Valid user input
 * @returns Weighted traits object
 * 
 * Requirements: 1.3, 1.4
 */
export function scoreTraits(input: UserInput): WeightedTraits {
  return {
    timeOfDay: {
      value: input.timeOfDay,
      weight: 1.0
    },
    weather: {
      value: input.weather,
      weight: 1.0
    },
    conflictStyle: {
      value: input.conflictStyle,
      weight: 2.0
    },
    snackFlavor: {
      value: input.snackFlavor,
      weight: 1.0
    },
    ambition: {
      value: input.ambition,
      weight: 2.0
    }
  };
}
