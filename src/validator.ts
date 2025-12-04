/**
 * Input validation for Monster Matchmaker
 */

import { UserInput, ValidationResult } from './types';

/**
 * Required attribute keys for valid user input
 */
const REQUIRED_ATTRIBUTES: (keyof UserInput)[] = [
  'timeOfDay',
  'weather',
  'conflictStyle',
  'snackFlavor',
  'ambition'
];

/**
 * Validates that user input contains exactly five required attributes
 * 
 * @param input - Partial user input to validate
 * @returns ValidationResult indicating success or error
 * 
 * Requirements: 1.1, 1.2, 1.5
 */
export function validateInput(input: Partial<UserInput>): ValidationResult {
  // Check if input is null or undefined
  if (input === null || input === undefined) {
    return {
      success: false,
      error: 'Input is null or undefined'
    };
  }

  // Get all keys from the input
  const inputKeys = Object.keys(input);

  // Check for exactly 5 attributes
  if (inputKeys.length !== 5) {
    return {
      success: false,
      error: `Expected exactly 5 attributes, but received ${inputKeys.length}`
    };
  }

  // Check that all required attributes are present
  const missingAttributes: string[] = [];
  for (const attr of REQUIRED_ATTRIBUTES) {
    if (!(attr in input) || input[attr] === null || input[attr] === undefined) {
      missingAttributes.push(attr);
    }
  }

  if (missingAttributes.length > 0) {
    return {
      success: false,
      error: `Missing required attributes: ${missingAttributes.join(', ')}`
    };
  }

  // Verify no extra attributes
  const extraAttributes = inputKeys.filter(key => !REQUIRED_ATTRIBUTES.includes(key as keyof UserInput));
  if (extraAttributes.length > 0) {
    return {
      success: false,
      error: `Unexpected attributes: ${extraAttributes.join(', ')}`
    };
  }

  return {
    success: true
  };
}
