# Implementation Plan

- [x] 1. Set up project structure and type definitions
  - Create TypeScript project with necessary configuration
  - Define core interfaces: UserInput, MonsterPersona, WeightedTraits, ValidationResult, Result type
  - Set up testing framework (Jest) and fast-check for property-based testing
  - _Requirements: 1.1, 1.2_

- [x] 2. Implement Monster Catalog
  - Create MonsterCatalog class with the 15 predefined monster personas
  - Implement getAll() and getByName() methods
  - Ensure each monster has exactly 5-word trait summary
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 2.1 Write property test for catalog size and structure
  - **Property 12: Catalog contains exactly 15 monsters**
  - **Validates: Requirements 5.1, 5.3**

- [x] 2.2 Write property test for trait summary word limits
  - **Property 13: Trait summaries respect word limit**
  - **Validates: Requirements 5.2**

- [x] 2.3 Write property test for catalog immutability
  - **Property 14: Catalog maintains data integrity**
  - **Validates: Requirements 5.4, 5.5**

- [x] 3. Implement Input Validator
  - Create validateInput function that checks for exactly 5 attributes
  - Verify all required fields are present: timeOfDay, weather, conflictStyle, snackFlavor, ambition
  - Return ValidationResult with success/error status
  - _Requirements: 1.1, 1.2, 1.5_

- [x] 3.1 Write property test for input validation
  - **Property 1: Input validation requires exactly five attributes**
  - **Validates: Requirements 1.1, 1.2**

- [x] 3.2 Write property test for invalid input rejection
  - **Property 3: Invalid inputs are rejected**
  - **Validates: Requirements 1.5**

- [x] 4. Implement Trait Scorer
  - Create scoreTraits function that applies weighting rules
  - Apply weight 1.0 to timeOfDay, weather, snackFlavor
  - Apply weight 2.0 to conflictStyle, ambition
  - Return WeightedTraits object
  - _Requirements: 1.3, 1.4_

- [x] 4.1 Write property test for attribute weighting
  - **Property 2: Attribute weighting follows specification**
  - **Validates: Requirements 1.3, 1.4**

- [x] 5. Implement Archetype Correlator
  - Create correlateArchetype function using semantic keyword matching
  - Extract keywords from user inputs and match to monster traits
  - Apply weight multipliers from WeightedTraits
  - Select monster with highest weighted correlation score
  - Implement deterministic tie-breaking (alphabetical order)
  - _Requirements: 2.1, 2.3_

- [x] 5.1 Write property test for catalog evaluation
  - **Property 4: Correlation evaluates complete catalog**
  - **Validates: Requirements 2.1**

- [x] 5.2 Write property test for single monster assignment
  - **Property 5: Assignment returns exactly one monster**
  - **Validates: Requirements 2.3**

- [x] 5.3 Write property test for trait summary matching
  - **Property 6: Trait summary matches catalog**
  - **Validates: Requirements 2.4**

- [x] 6. Implement Rationale Generator
  - Create generateRationale function that produces 2-3 sentence justification
  - Ensure rationale references double-weighted traits (conflict, ambition)
  - Include references to user attributes and monster traits
  - Enforce 50-word maximum limit
  - Use humorous and creative language
  - _Requirements: 2.5, 7.1, 7.4, 7.5_

- [x] 6.1 Write property test for double-weighted trait references
  - **Property 7: Rationale references double-weighted traits**
  - **Validates: Requirements 2.5, 7.1**

- [x] 6.2 Write property test for rationale word limit
  - **Property 10: Rationale respects word limit**
  - **Validates: Requirements 3.3, 7.5**

- [x] 6.3 Write property test for rationale content
  - **Property 16: Rationale mentions user attributes and monster traits**
  - **Validates: Requirements 7.4**

- [x] 7. Implement Image Prompt Builder
  - Create buildImagePrompt function that constructs the image generation prompt
  - Include source image reference placeholder
  - Add neon-gothic horror style descriptor
  - Include electric violet color code #8E48FF
  - Specify foggy city street background
  - Add technical quality descriptors (photorealistic, 8k, cinematic volumetric lighting)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7.1 Write property test for image prompt completeness
  - **Property 11: Image prompt contains required elements**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [x] 8. Implement Output Formatter
  - Create formatOutput function that assembles the final JSON
  - Build assignment_result object with assigned_persona, rationale, core_trait_summary
  - Add image_generation_prompt field
  - Minify JSON output (no extra whitespace)
  - Ensure no text before or after JSON
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [x] 8.1 Write property test for JSON validity
  - **Property 8: Output is valid minified JSON**
  - **Validates: Requirements 3.1, 3.5**

- [x] 8.2 Write property test for JSON structure
  - **Property 9: JSON structure is complete**
  - **Validates: Requirements 3.2, 3.4**

- [x] 9. Implement Processing Pipeline
  - Create main pipeline function that orchestrates all stages
  - Chain stages: validation → weighting → correlation → rationale → image prompt → output
  - Use Result type for error propagation
  - Implement fail-fast behavior (halt on any error)
  - Ensure stages execute in correct order
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9.1 Write property test for pipeline execution order
  - **Property 15: Pipeline executes in correct order**
  - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Create main entry point and CLI interface
  - Create main function that accepts user input and returns JSON output
  - Add command-line interface for testing
  - Implement error handling and user-friendly error messages
  - _Requirements: 1.1, 3.1_

- [x] 11.1 Write integration tests for end-to-end flow
  - Test complete pipeline with realistic user inputs
  - Verify golden test cases (known input-output pairs)
  - Test error scenarios with invalid inputs

- [x] 12. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Set up Next.js application structure
  - Initialize Next.js 14+ project with App Router
  - Configure TypeScript and Tailwind CSS
  - Set up project directory structure (app/, components/, lib/, types/)
  - Create base layout with neon-gothic horror theme
  - _Requirements: 8.1, 12.1, 12.2, 12.3_

- [x] 14. Create API route for monster matchmaker
  - Implement POST /api/matchmaker endpoint
  - Integrate ARCANA-ENGINE pipeline into API handler
  - Handle request validation and error responses
  - Return JSON response with proper status codes and CORS headers
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 14.1 Write integration tests for API route
  - Test successful quiz submissions return 200 with valid JSON
  - Test invalid inputs return 400 with error messages
  - Test CORS headers are present in responses

- [x] 15. Implement ImageUpload component
  - Create file input component with drag-and-drop support
  - Add "Skip" button for optional image upload
  - Validate uploaded files are images (jpg, png, webp)
  - Display image preview after upload
  - Allow clearing/removing selected image
  - Handle image encoding for API submission
  - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.7_

- [x] 15.1 Write unit tests for ImageUpload component
  - Test file validation rejects non-image files
  - Test preview displays after valid upload
  - Test "Skip" button allows proceeding without image
  - Test clearing selected image works correctly
  - Test component handles missing image gracefully

- [x] 16. Implement QuizPage component
  - Create multi-step form that displays one question at a time
  - Implement step navigation with currentStep state (0-5)
  - Add dropdown/select inputs for Time of Day, Weather, Conflict Style, Snack Flavor, Ambition
  - Include "Other" option in each dropdown that reveals a text input field
  - Handle both predefined selections and custom "Other" text inputs
  - Add "Next" button that is disabled until current question is answered
  - Add "Back" button on steps 2-5 to return to previous question
  - Show progress indicator (e.g., "Question 1 of 5")
  - Add optional image upload as final step (step 5) with clear "Optional" label
  - Integrate ImageUpload component on final step
  - Replace "Next" with "Submit" button on final step
  - Implement form validation for each step
  - Call API route on submission and handle loading state
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 9.1, 9.2, 9.5, 9.6_

- [x] 16.1 Write unit tests for QuizPage component
  - Test only one question displays at a time
  - Test "Next" button is disabled when current question unanswered
  - Test "Next" button advances to next step when question answered
  - Test "Back" button returns to previous step
  - Test "Back" button is hidden on first question
  - Test progress indicator shows correct step number
  - Test "Other" option reveals text input field
  - Test custom "Other" text is accepted as valid input
  - Test image upload step is clearly marked as optional
  - Test form can be submitted without uploading image
  - Test form submission calls API with correct data (including custom values)
  - Test loading state displays during API call

- [x] 17. Implement ResultsPage component
  - Display assigned monster name with prominent typography
  - Show five-word core trait summary
  - Display humorous rationale text
  - Conditionally show user's uploaded photo only if one was provided
  - Hide transformation image section if no photo was uploaded
  - Add "Restart Quiz" and "Share Results" buttons
  - Apply neon-gothic horror styling with #8E48FF accents
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 9.6, 12.4, 12.5_

- [x] 17.1 Write unit tests for ResultsPage component
  - Test all result fields render correctly
  - Test transformation image section displays when image provided
  - Test transformation image section is hidden when no image provided
  - Test restart button navigates back to quiz
  - Test component handles missing image gracefully

- [x] 18. Implement routing and navigation
  - Set up Next.js App Router pages (/, /results)
  - Implement navigation from quiz to results after submission
  - Handle browser back button and direct URL access
  - Pass assignment data between pages using URL params or state
  - _Requirements: 8.5, 10.5_

- [x] 19. Apply neon-gothic horror theme styling
  - Create Tailwind CSS theme configuration with dark colors and #8E48FF accent
  - Design gothic typography using appropriate fonts
  - Implement smooth transitions and hover effects
  - Add atmospheric visual elements (fog effects, shadows, glows)
  - Ensure responsive design for mobile and desktop
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 20. End-to-end testing and polish
  - Test complete user flow from quiz to results
  - Verify all 15 monsters can be assigned
  - Test image upload and display pipeline
  - Verify responsive design on different screen sizes
  - Test error handling for network failures
  - _Requirements: All_

- [x] 21. Final Checkpoint - Complete application testing
  - Ensure all tests pass, ask the user if questions arise.
