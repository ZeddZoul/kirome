/**
 * Output Formatter - Assembles the final JSON response
 */

import { MonsterPersona, AssignmentResult, OutputJSON } from './types';

/**
 * Formats the final output as minified JSON
 * 
 * @param monster - The assigned monster persona
 * @param rationale - The generated rationale text
 * @param imagePrompt - The image generation prompt
 * @returns Minified JSON string with no extra whitespace
 * 
 * Requirements: 3.1, 3.2, 3.4, 3.5
 */
export function formatOutput(
  monster: MonsterPersona,
  rationale: string,
  imagePrompt: string
): string {
  // Build the assignment_result object
  const assignmentResult: AssignmentResult = {
    assigned_persona: monster.name,
    rationale: rationale,
    core_trait_summary: monster.traitSummary
  };

  // Build the complete output structure
  const output: OutputJSON = {
    assignment_result: assignmentResult,
    image_generation_prompt: imagePrompt
  };

  // Return minified JSON (no extra whitespace)
  return JSON.stringify(output);
}
