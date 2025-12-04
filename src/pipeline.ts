/**
 * Processing Pipeline - Orchestrates all stages of monster assignment
 */

import { UserInput, Result, MonsterPersona } from './types';
import { validateInput } from './validator';
import { scoreTraits } from './scorer';
import { correlateArchetype } from './correlator';
import { generateRationale } from './rationale';
import { buildImagePrompt } from './imagePrompt';
import { formatOutput } from './formatter';
import { MonsterCatalog } from './catalog';

/**
 * Main pipeline function that orchestrates all stages
 * Executes in strict order: validation → weighting → correlation → rationale → image prompt → output
 * Implements fail-fast behavior - halts on any error
 * 
 * @param input - User input to process
 * @param catalog - Monster catalog (optional, creates new instance if not provided)
 * @returns Result containing JSON output string or error message
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
export function processPipeline(
  input: Partial<UserInput>,
  catalog?: MonsterCatalog
): Result<string> {
  // Stage 1: Input Validation (Requirement 6.1)
  const validationResult = validateInput(input);
  if (!validationResult.success) {
    return {
      success: false,
      error: `Validation failed: ${validationResult.error}`
    };
  }

  // At this point, we know input is valid UserInput
  const validInput = input as UserInput;

  // Stage 2: Trait Weighting (Requirement 6.2)
  let weightedTraits;
  try {
    weightedTraits = scoreTraits(validInput);
  } catch (error) {
    return {
      success: false,
      error: `Trait scoring failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }

  // Stage 3: Archetype Correlation (Requirement 6.3)
  let assignedMonster: MonsterPersona;
  try {
    const monsterCatalog = catalog || new MonsterCatalog();
    assignedMonster = correlateArchetype(weightedTraits, monsterCatalog);
  } catch (error) {
    return {
      success: false,
      error: `Archetype correlation failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }

  // Stage 4: Rationale Generation (Requirement 6.4)
  let rationale: string;
  try {
    rationale = generateRationale(validInput, assignedMonster);
  } catch (error) {
    return {
      success: false,
      error: `Rationale generation failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }

  // Stage 5: Image Prompt Building (Requirement 6.4)
  let imagePrompt: string;
  try {
    imagePrompt = buildImagePrompt(assignedMonster);
  } catch (error) {
    return {
      success: false,
      error: `Image prompt generation failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }

  // Stage 6: Output Formatting (Requirement 6.4)
  let output: string;
  try {
    output = formatOutput(assignedMonster, rationale, imagePrompt);
  } catch (error) {
    return {
      success: false,
      error: `Output formatting failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }

  // Return successful result
  return {
    success: true,
    value: output
  };
}
