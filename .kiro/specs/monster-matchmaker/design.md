# Design Document

## Overview

The Monster Matchmaker is a Next.js web application that combines a personality-to-archetype classification engine with an interactive user interface. The system maps user attributes to monster personas through weighted trait analysis using a functional pipeline pattern. The architecture separates concerns between the frontend (React components for quiz and results), the backend (Next.js API routes), and the core logic (Kiroween Kinship Engine classification pipeline). Users interact with a neon-gothic horror themed interface to answer personality questions, upload photos, and receive their monster assignment with a personalized transformation image prompt.

## Architecture

The system follows a three-tier Next.js architecture:

### Frontend Layer (React Components)
```
Quiz Page → Results Page
```

**Quiz Page**: Multi-step form with five personality questions and image upload
**Results Page**: Displays monster assignment, rationale, traits, and transformation prompt

### API Layer (Next.js API Routes)
```
POST /api/matchmaker → Kiroween Kinship Engine Pipeline → JSON Response
```

**API Route**: Receives quiz submissions, invokes classification logic, returns results

### Core Logic Layer (Kiroween Kinship Engine)
```
Input Layer → Validation Layer → Scoring Layer → Correlation Layer → Output Layer
```

**Input Layer**: Receives five user attributes and an optional image reference
**Validation Layer**: Ensures input completeness and type correctness
**Scoring Layer**: Applies weighting rules to attributes (normal vs double weight)
**Correlation Layer**: Matches weighted attributes to monster personas using semantic similarity
**Output Layer**: Constructs the JSON response with assignment results and image prompt

The core classification logic is stateless and deterministic - identical inputs always produce identical outputs. The frontend communicates with the backend via REST API calls.

## Components and Interfaces

### Frontend Components

#### 1. QuizPage Component

**Responsibility**: Render a multi-step personality quiz interface showing one question at a time, with navigation between steps and support for custom "Other" responses

**Interface**:
```typescript
interface QuizPageProps {}

interface QuizState {
  currentStep: number; // 0-5 (0-4 for questions, 5 for optional image upload)
  answers: {
    timeOfDay: string;
    weather: string;
    conflictStyle: string;
    snackFlavor: string;
    ambition: string;
  };
  uploadedImage: File | null;
  showOtherInput: boolean; // For current question
}

function QuizPage(): JSX.Element {
  // Renders one question at a time with Next/Back/Submit buttons
  // Handles navigation between steps
  // Validates current answer before allowing Next
  // Shows optional image upload as final step
  // Submits to API when complete
}
```

#### 2. ResultsPage Component

**Responsibility**: Display the monster assignment results

**Interface**:
```typescript
interface ResultsPageProps {
  assignment: AssignmentResult;
  imagePrompt: string;
  userImage: string | null;
}

function ResultsPage(props: ResultsPageProps): JSX.Element {
  // Displays monster name, traits, rationale, and image
}
```

#### 3. ImageUpload Component

**Responsibility**: Handle optional image file selection and preview

**Interface**:
```typescript
interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImage: File | null;
  isOptional: boolean;
}

function ImageUpload(props: ImageUploadProps): JSX.Element {
  // Renders file input and image preview
  // Shows "Skip" option when isOptional is true
  // Allows clearing selected image
}
```

### API Layer

#### 4. Matchmaker API Route

**Responsibility**: Handle quiz submissions and return monster assignments

**Interface**:
```typescript
// POST /api/matchmaker
interface MatchmakerRequest {
  timeOfDay: string;
  weather: string;
  conflictStyle: string;
  snackFlavor: string;
  ambition: string;
  imageData?: string; // Base64 encoded image
}

interface MatchmakerResponse {
  assignment_result: AssignmentResult;
  image_generation_prompt: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MatchmakerResponse | ErrorResponse>
) {
  // Validates request, invokes Kiroween Kinship Engine, returns results
}
```

### Core Logic Components

#### 5. Input Validator

**Responsibility**: Validate that exactly five attributes are provided and properly categorized

**Interface**:
```typescript
interface UserInput {
  timeOfDay: string;
  weather: string;
  conflictStyle: string;
  snackFlavor: string;
  ambition: string;
}

function validateInput(input: Partial<UserInput>): ValidationResult {
  // Returns success or error with details
}
```

### 2. Monster Catalog

**Responsibility**: Store and retrieve monster persona definitions

**Interface**:
```typescript
interface MonsterPersona {
  name: string;
  traits: string[]; // 5-word core trait summary as array
  traitSummary: string; // Comma-separated trait string
}

class MonsterCatalog {
  getAll(): MonsterPersona[];
  getByName(name: string): MonsterPersona | null;
}
```

**Catalog Data**: The catalog contains 15 predefined monsters:
- Vampire: aristocratic, immortal, nocturnal, sophisticated, ancient
- Werewolf: primal rage, chaotic, transformative, passionate, wild
- Cthulhu: insanity-inducing, ancient, unknowable, cosmic, dread
- Frankenstein's Monster: misunderstood, constructed, lonely, searching, strong
- Mummy: cursed, vengeful, eternal, wrapped, entombed
- Zombie: mindless, relentless, contagious, hungry, shambling
- Banshee: sorrowful, loud, prophetic, ethereal, wailing
- Witch: cunning, mystical, powerful, herbology, secretive
- Headless Horseman: spectral, seeking lost, swift, determined, rider
- Cryptid: mysterious, prophetic, elusive, folklore, unseen
- Grim Reaper: inevitable, neutral, finality, silent, collector
- Poltergeist: invisible, destructive, mischievous, noisy, energetic
- Demogorgon: interdimensional hunter, primal, terrifying, predator, gate-opener
- Alien Parasite: infiltrating, subtle, control, hidden, symbiotic
- Gorgon: stone gaze, transformative, deadly, beautiful, serpentine

### 3. Trait Scorer

**Responsibility**: Apply weighting rules to user attributes

**Interface**:
```typescript
interface WeightedTraits {
  timeOfDay: { value: string; weight: number };
  weather: { value: string; weight: number };
  conflictStyle: { value: string; weight: number };
  snackFlavor: { value: string; weight: number };
  ambition: { value: string; weight: number };
}

function scoreTraits(input: UserInput): WeightedTraits {
  // Applies normal (1.0) or double (2.0) weighting
}
```

### 4. Archetype Correlator

**Responsibility**: Match weighted user traits to the most conceptually adjacent monster

**Interface**:
```typescript
interface CorrelationScore {
  monster: MonsterPersona;
  score: number;
  reasoning: string[];
}

function correlateArchetype(
  weightedTraits: WeightedTraits,
  catalog: MonsterCatalog
): MonsterPersona {
  // Returns the best-matching monster
}
```

**Correlation Strategy**: The correlator uses semantic keyword matching and conceptual adjacency:
- Extract keywords from user inputs (e.g., "night" → nocturnal, "chaos" → chaotic)
- Match keywords to monster trait summaries with weight multipliers
- Prioritize matches on double-weighted attributes (conflict, ambition)
- Select the monster with the highest weighted correlation score

### 5. Rationale Generator

**Responsibility**: Create humorous justification linking user traits to assigned monster

**Interface**:
```typescript
function generateRationale(
  input: UserInput,
  monster: MonsterPersona,
  maxWords: number = 50
): string {
  // Returns 2-3 sentence humorous explanation
}
```

### 6. Image Prompt Builder

**Responsibility**: Construct the image generation prompt with proper formatting

**Interface**:
```typescript
interface ImagePromptConfig {
  monsterName: string;
  style: string;
  lighting: string;
  background: string;
  quality: string[];
}

function buildImagePrompt(monster: MonsterPersona): string {
  // Returns formatted prompt string
}
```

### 7. Output Formatter

**Responsibility**: Assemble the final JSON response

**Interface**:
```typescript
interface AssignmentResult {
  assigned_persona: string;
  rationale: string;
  core_trait_summary: string;
}

interface OutputJSON {
  assignment_result: AssignmentResult;
  image_generation_prompt: string;
}

function formatOutput(
  monster: MonsterPersona,
  rationale: string,
  imagePrompt: string
): string {
  // Returns minified JSON string
}
```

## Data Models

### UserInput
```typescript
interface UserInput {
  timeOfDay: string;      // I1: Normal weight
  weather: string;        // I2: Normal weight
  conflictStyle: string;  // I3: Double weight
  snackFlavor: string;    // I4: Normal weight
  ambition: string;       // I5: Double weight
}
```

### MonsterPersona
```typescript
interface MonsterPersona {
  name: string;
  traits: string[];
  traitSummary: string;
}
```

### ProcessingPipeline
```typescript
interface ProcessingPipeline {
  input: UserInput;
  validated: boolean;
  weightedTraits: WeightedTraits;
  assignedMonster: MonsterPersona;
  rationale: string;
  imagePrompt: string;
  output: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Input validation requires exactly five attributes
*For any* input object, validation should succeed if and only if exactly five attributes are provided (timeOfDay, weather, conflictStyle, snackFlavor, ambition).
**Validates: Requirements 1.1, 1.2**

### Property 2: Attribute weighting follows specification
*For any* valid user input, the trait scorer should assign weight 1.0 to timeOfDay, weather, and snackFlavor, and weight 2.0 to conflictStyle and ambition.
**Validates: Requirements 1.3, 1.4**

### Property 3: Invalid inputs are rejected
*For any* input with missing, null, or undefined attributes, the validation function should return an error result and prevent further processing.
**Validates: Requirements 1.5**

### Property 4: Correlation evaluates complete catalog
*For any* valid weighted traits, the archetype correlator should evaluate all 15 monster personas from the catalog before selecting the best match.
**Validates: Requirements 2.1**

### Property 5: Assignment returns exactly one monster
*For any* valid user input, the system should assign exactly one monster persona, never zero or multiple.
**Validates: Requirements 2.3**

### Property 6: Trait summary matches catalog
*For any* assigned monster, the returned core trait summary should exactly match the trait summary stored in the Monster Catalog for that monster.
**Validates: Requirements 2.4**

### Property 7: Rationale references double-weighted traits
*For any* generated rationale, the text should contain references to at least one of the double-weighted attributes (conflictStyle or ambition).
**Validates: Requirements 2.5, 7.1**

### Property 8: Output is valid minified JSON
*For any* system output, the entire output string should be parseable as valid JSON with no extraneous text before or after, and should contain no unnecessary whitespace.
**Validates: Requirements 3.1, 3.5**

### Property 9: JSON structure is complete
*For any* output JSON, it should contain an assignment_result object with assigned_persona, rationale, and core_trait_summary fields, plus an image_generation_prompt field at the root level.
**Validates: Requirements 3.2, 3.4**

### Property 10: Rationale respects word limit
*For any* generated rationale, the word count should not exceed 50 words.
**Validates: Requirements 3.3, 7.5**

### Property 11: Image prompt contains required elements
*For any* generated image prompt, it should include: source image reference, the assigned monster name, neon-gothic horror style descriptor, color code #8E48FF, foggy city street background, and technical quality terms (photorealistic, 8k, cinematic).
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

### Property 12: Catalog contains exactly 15 monsters
*For any* catalog instance, it should contain exactly 15 monster personas with the specified names.
**Validates: Requirements 5.1, 5.3**

### Property 13: Trait summaries respect word limit
*For any* monster in the catalog, its trait summary should contain at most 5 words.
**Validates: Requirements 5.2**

### Property 14: Catalog maintains data integrity
*For any* monster persona, retrieving it from the catalog multiple times should return identical data, demonstrating immutability.
**Validates: Requirements 5.4, 5.5**

### Property 15: Pipeline executes in correct order
*For any* input, the system should execute stages in strict sequence: validation → weighting → correlation → finalization → JSON generation, with any failure halting the pipeline immediately.
**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 16: Rationale mentions user attributes and monster traits
*For any* generated rationale, it should reference at least one user attribute value and at least one trait from the assigned monster's trait summary.
**Validates: Requirements 7.4**

## Error Handling

The system employs a fail-fast approach with explicit error types:

### Error Types

1. **ValidationError**: Thrown when input validation fails
   - Missing attributes
   - Wrong number of attributes
   - Invalid attribute types

2. **CorrelationError**: Thrown when archetype correlation fails
   - Empty catalog
   - No valid correlation scores

3. **OutputError**: Thrown when JSON generation fails
   - Missing required fields
   - JSON serialization failure

### Error Propagation

The pipeline uses a Result type pattern to propagate errors without exceptions:

```typescript
type Result<T, E> = 
  | { success: true; value: T }
  | { success: false; error: E };
```

Each pipeline stage returns a Result, allowing the next stage to short-circuit on failure. This ensures that errors in early stages (like validation) prevent execution of later stages (like JSON generation).

### Error Messages

Error messages should be descriptive and include:
- The stage where the error occurred
- The specific validation or processing rule that failed
- Guidance on how to correct the input (when applicable)

## Testing Strategy

The Monster Matchmaker system will employ a dual testing approach combining unit tests for specific behaviors and property-based tests for universal correctness guarantees.

### Unit Testing Approach

Unit tests will verify:
- **Catalog initialization**: Verify the catalog loads with exactly 15 monsters with correct names and trait summaries
- **Edge cases**: Empty strings, whitespace-only inputs, special characters in attributes
- **Specific examples**: Known input-output pairs that demonstrate correct behavior
- **Error conditions**: Invalid inputs trigger appropriate error types
- **JSON formatting**: Output matches the exact structure specification

Example unit tests:
- Test that "night" + "stormy" + "avoidance" + "sweet" + "power" assigns a specific monster
- Test that missing the "ambition" field triggers a ValidationError
- Test that the output JSON can be parsed and contains all required fields

### Property-Based Testing Approach

Property-based tests will verify universal properties across randomly generated inputs. The system will use **fast-check** (for TypeScript/JavaScript) as the property-based testing library.

**Configuration**: Each property-based test will run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Tagging Convention**: Each property-based test will include a comment tag in this exact format:
```typescript
// Feature: monster-matchmaker, Property {number}: {property_text}
```

**Test Generators**:
- **Valid input generator**: Produces random UserInput objects with all five attributes populated
- **Invalid input generator**: Produces inputs with missing, null, or extra attributes
- **Weighted traits generator**: Produces random WeightedTraits objects with correct weight values
- **Monster catalog generator**: Produces catalog instances with varying monster definitions

**Property Test Coverage**:
Each of the 16 correctness properties will be implemented as a single property-based test:

1. Property 1: Generate random inputs with varying attribute counts, verify only 5-attribute inputs pass validation
2. Property 2: Generate random valid inputs, verify weights are 1.0 for normal and 2.0 for double-weighted
3. Property 3: Generate random invalid inputs, verify all are rejected with errors
4. Property 4: Generate random weighted traits, verify correlator accesses all 15 catalog entries
5. Property 5: Generate random valid inputs, verify output always contains exactly one monster
6. Property 6: Generate random valid inputs, verify trait summary matches catalog for assigned monster
7. Property 7: Generate random valid inputs, verify rationale mentions conflict or ambition
8. Property 8: Generate random valid inputs, verify output is parseable JSON with no extra text
9. Property 9: Generate random valid inputs, verify JSON structure contains all required fields
10. Property 10: Generate random valid inputs, verify rationale word count ≤ 50
11. Property 11: Generate random valid inputs, verify image prompt contains all required elements
12. Property 12: Verify catalog always contains exactly 15 monsters (invariant test)
13. Property 13: Verify all catalog trait summaries contain ≤ 5 words (invariant test)
14. Property 14: Generate random catalog access patterns, verify data remains identical
15. Property 15: Generate random inputs including invalid ones, verify pipeline order and error halting
16. Property 16: Generate random valid inputs, verify rationale mentions both user attributes and monster traits

### Integration Testing

Integration tests will verify the complete end-to-end flow:
- Full pipeline execution from raw input to JSON output
- Interaction between all components (validator → scorer → correlator → formatter)
- Realistic user scenarios with actual personality attribute combinations

### Test Data

The test suite will include:
- **Golden test cases**: Known input-output pairs that serve as regression tests
- **Edge case inputs**: Boundary conditions like empty strings, very long strings, special characters
- **Catalog fixtures**: The complete 15-monster catalog with verified trait summaries
- **Image prompt templates**: Expected prompt structure for validation

## Implementation Notes

### Language and Framework

The application will be built using:
- **Next.js 14+** with App Router for the web framework
- **TypeScript** for type safety across frontend and backend
- **React** for UI components
- **Tailwind CSS** for styling with neon-gothic horror theme
- **Jest** and **fast-check** for testing

The functional pipeline pattern in the core logic maps naturally to TypeScript's type system.

### Performance Considerations

- The correlation algorithm should be O(n*m) where n = number of monsters (15) and m = average trait count per monster (5), resulting in constant-time performance
- JSON minification should use native JSON.stringify without pretty-printing
- The catalog should be loaded once at initialization and reused across all requests

### Extensibility

The design supports future extensions:
- Adding new monsters to the catalog (update the catalog data structure)
- Modifying weighting rules (update the scorer configuration)
- Changing correlation algorithms (swap the correlator implementation)
- Adding new output formats (add new formatters alongside JSON formatter)

### Determinism

The system must be deterministic - identical inputs always produce identical outputs. This requires:
- No random number generation in the correlation algorithm
- No timestamp or session-specific data in outputs
- Consistent tie-breaking rules when multiple monsters have equal correlation scores (e.g., alphabetical order)
