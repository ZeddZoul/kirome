/**
 * Core type definitions for the Monster Matchmaker system
 */

/**
 * User input containing five personality attributes
 */
export interface UserInput {
  timeOfDay: string;      // Normal weight (1.0)
  weather: string;        // Normal weight (1.0)
  conflictStyle: string;  // Double weight (2.0)
  snackFlavor: string;    // Normal weight (1.0)
  ambition: string;       // Double weight (2.0)
}

/**
 * Monster persona with name and trait information
 */
export interface MonsterPersona {
  name: string;
  traits: string[];       // 5-word core trait summary as array
  traitSummary: string;   // Comma-separated trait string
}

/**
 * Weighted trait with value and weight multiplier
 */
export interface WeightedTrait {
  value: string;
  weight: number;
}

/**
 * User traits with applied weighting
 */
export interface WeightedTraits {
  timeOfDay: WeightedTrait;
  weather: WeightedTrait;
  conflictStyle: WeightedTrait;
  snackFlavor: WeightedTrait;
  ambition: WeightedTrait;
}

/**
 * Result of input validation
 */
export interface ValidationResult {
  success: boolean;
  error?: string;
}

/**
 * Generic Result type for error propagation
 */
export type Result<T, E = string> = 
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Assignment result containing monster assignment details
 */
export interface AssignmentResult {
  assigned_persona: string;
  rationale: string;
  core_trait_summary: string;
}

/**
 * Final output JSON structure
 */
export interface OutputJSON {
  assignment_result: AssignmentResult;
  image_generation_prompt: string;
}

/**
 * Configuration for image prompt generation
 */
export interface ImagePromptConfig {
  monsterName: string;
  style: string;
  lighting: string;
  background: string;
  quality: string[];
}

/**
 * Correlation score for archetype matching
 */
export interface CorrelationScore {
  monster: MonsterPersona;
  score: number;
  reasoning: string[];
}
