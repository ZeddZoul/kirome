// Shared types for the Monster Matchmaker Next.js application

export interface UserInput {
  timeOfDay: string;
  weather: string;
  conflictStyle: string;
  snackFlavor: string;
  ambition: string;
}

export interface AssignmentResult {
  assigned_persona: string;
  rationale: string;
  core_trait_summary: string;
}

export interface MatchmakerResponse {
  assignment_result: AssignmentResult;
  image_generation_prompt: string;
}

export interface MatchmakerRequest extends UserInput {
  imageData?: string; // Base64 encoded image
}
