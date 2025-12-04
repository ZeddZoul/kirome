# Requirements Document

## Introduction

The Kiroween Kinship: Ultimate Monster Matchmaker is an interactive Next.js web application that assigns users to monster personas based on five personality attributes. The system uses weighted trait analysis to match users with one of fifteen classic monster archetypes and generates a personalized transformation image prompt. Users interact with the application through a web interface where they answer personality questions, upload a photo, and receive their monster assignment with a visual transformation. The application processes user inputs through a deterministic classification engine and outputs a structured JSON response containing the monster assignment, rationale, and an image generation prompt that references the user's uploaded photo.

## Glossary

- **ARCANA-ENGINE**: The core classification system that processes user attributes and assigns monster personas
- **Monster Catalog**: A predefined collection of fifteen monster archetypes with associated trait summaries
- **Trait Weighting**: A scoring mechanism where certain attributes (Conflict and Ambition) receive double importance in the classification algorithm
- **Assignment Logic**: The algorithmic process that correlates user attributes to monster personas using creative archetype matching
- **Image Generation Prompt**: A structured text description designed for AI image generation models that transforms the user's photo into their assigned monster persona
- **Source Image Reference**: The user's uploaded photograph used as the visual basis for the transformation
- **Core Trait Summary**: A five-word maximum description of each monster's defining characteristics
- **Quiz Interface**: The web UI component where users answer the five personality questions
- **Results Page**: The web page that displays the assigned monster, rationale, and transformation image
- **API Route**: A Next.js API endpoint that processes user inputs and returns the monster assignment

## Requirements

### Requirement 1

**User Story:** As a user, I want to provide five distinct personality attributes, so that the system can analyze my traits and match me with a monster persona.

#### Acceptance Criteria

1. WHEN a user submits input data THEN the ARCANA-ENGINE SHALL validate that exactly five attributes are provided
2. WHEN the ARCANA-ENGINE receives the five attributes THEN the system SHALL categorize them as Time of Day, Weather, Conflict Style, Snack Flavor, and Ambition
3. WHEN processing attributes THEN the ARCANA-ENGINE SHALL apply normal weighting to Time of Day, Weather, and Snack Flavor attributes
4. WHEN processing attributes THEN the ARCANA-ENGINE SHALL apply double weighting to Conflict Style and Ambition attributes
5. WHEN any attribute is missing or invalid THEN the ARCANA-ENGINE SHALL reject the input and signal an error

### Requirement 2

**User Story:** As a user, I want the system to match my attributes to one of fifteen monster personas, so that I receive a personalized and creative monster assignment.

#### Acceptance Criteria

1. WHEN the ARCANA-ENGINE processes weighted attributes THEN the system SHALL evaluate all fifteen monster personas from the Monster Catalog
2. WHEN evaluating personas THEN the ARCANA-ENGINE SHALL use creative archetype correlation to determine conceptual adjacency between user traits and monster characteristics
3. WHEN multiple monsters have similar correlation scores THEN the ARCANA-ENGINE SHALL select the single most conceptually adjacent monster
4. WHEN a monster is selected THEN the ARCANA-ENGINE SHALL retrieve the corresponding five-word core trait summary from the Monster Catalog
5. WHEN the assignment is complete THEN the ARCANA-ENGINE SHALL generate a humorous justification that links the user's double-weighted traits to the chosen persona

### Requirement 3

**User Story:** As a user, I want to receive a structured JSON output with my monster assignment, so that the application can display my results and generate my transformation image.

#### Acceptance Criteria

1. WHEN the ARCANA-ENGINE completes the assignment THEN the system SHALL output a single minified JSON object
2. WHEN generating the JSON output THEN the ARCANA-ENGINE SHALL include an assignment_result object containing assigned_persona, rationale, and core_trait_summary fields
3. WHEN generating the rationale THEN the ARCANA-ENGINE SHALL limit the text to a maximum of fifty words across two to three sentences
4. WHEN generating the JSON output THEN the ARCANA-ENGINE SHALL include an image_generation_prompt field with a complete transformation description
5. WHEN outputting the JSON THEN the ARCANA-ENGINE SHALL produce no additional text, explanations, or formatting before or after the JSON object

### Requirement 4

**User Story:** As a user, I want the system to generate an image prompt that transforms my uploaded photo into my assigned monster, so that I can visualize myself as that monster persona.

#### Acceptance Criteria

1. WHEN generating the image prompt THEN the ARCANA-ENGINE SHALL reference the user's uploaded source image as the visual basis
2. WHEN constructing the image prompt THEN the ARCANA-ENGINE SHALL specify a neon-gothic horror aesthetic style
3. WHEN constructing the image prompt THEN the ARCANA-ENGINE SHALL include lighting specifications with electric violet color code #8E48FF
4. WHEN constructing the image prompt THEN the ARCANA-ENGINE SHALL specify a foggy city street background setting
5. WHEN constructing the image prompt THEN the ARCANA-ENGINE SHALL include technical quality descriptors such as photorealistic, 8k resolution, and cinematic volumetric lighting

### Requirement 5

**User Story:** As a system administrator, I want the Monster Catalog to contain exactly fifteen predefined personas with consistent trait summaries, so that the classification system operates deterministically.

#### Acceptance Criteria

1. WHEN the ARCANA-ENGINE initializes THEN the system SHALL load a Monster Catalog containing exactly fifteen monster personas
2. WHEN storing monster data THEN the system SHALL associate each persona with a five-word maximum core trait summary
3. WHEN the Monster Catalog is queried THEN the system SHALL return personas including Vampire, Werewolf, Cthulhu, Frankenstein's Monster, Mummy, Zombie, Banshee, Witch, Headless Horseman, Cryptid, Grim Reaper, Poltergeist, Demogorgon, Alien Parasite, and Gorgon
4. WHEN a persona is retrieved THEN the system SHALL provide its complete trait summary without modification
5. WHEN the catalog is accessed THEN the system SHALL maintain immutable persona definitions throughout the application lifecycle

### Requirement 6

**User Story:** As a developer, I want the system to process inputs through a strict hierarchical logic flow, so that monster assignments are consistent and traceable.

#### Acceptance Criteria

1. WHEN the ARCANA-ENGINE receives input THEN the system SHALL execute input validation before trait weighting
2. WHEN input validation passes THEN the ARCANA-ENGINE SHALL execute trait weighting before archetype correlation
3. WHEN trait weighting completes THEN the ARCANA-ENGINE SHALL execute archetype correlation before assignment finalization
4. WHEN archetype correlation completes THEN the ARCANA-ENGINE SHALL execute assignment finalization before JSON generation
5. WHEN any step fails THEN the ARCANA-ENGINE SHALL halt processing and signal an error without proceeding to subsequent steps

### Requirement 7

**User Story:** As a user, I want the rationale for my monster assignment to be creative and humorous, so that the experience is entertaining and engaging.

#### Acceptance Criteria

1. WHEN generating the rationale THEN the ARCANA-ENGINE SHALL prioritize references to the double-weighted traits of Conflict Style and Ambition
2. WHEN constructing the justification THEN the ARCANA-ENGINE SHALL extend beyond literal interpretation of the input facts
3. WHEN writing the rationale THEN the ARCANA-ENGINE SHALL employ humor and creative language
4. WHEN the rationale is complete THEN the ARCANA-ENGINE SHALL ensure it conceptually links the user's attributes to the monster's core traits
5. WHEN validating the rationale THEN the ARCANA-ENGINE SHALL confirm the text does not exceed fifty words

### Requirement 8

**User Story:** As a user, I want to interact with a web interface to answer personality questions one at a time, so that I can focus on each question without feeling overwhelmed.

#### Acceptance Criteria

1. WHEN a user visits the application THEN the Quiz Interface SHALL display one question at a time
2. WHEN a user views a question THEN the Quiz Interface SHALL provide clear input options for that attribute
3. WHEN a user views a question THEN the Quiz Interface SHALL include an "Other" option that allows custom text input
4. WHEN a user selects "Other" THEN the Quiz Interface SHALL display a text input field for that question
5. WHEN a user enters custom text for "Other" THEN the system SHALL accept the custom value as the attribute response
6. WHEN a user answers a question THEN the Quiz Interface SHALL enable a "Next" button to proceed to the next question
7. WHEN a user has not answered the current question THEN the Quiz Interface SHALL disable the "Next" button
8. WHEN a user completes all five questions THEN the Quiz Interface SHALL display a "Submit" button instead of "Next"
9. WHEN a user is on a question after the first THEN the Quiz Interface SHALL provide a "Back" button to return to the previous question
10. WHEN a user submits the quiz THEN the Quiz Interface SHALL send the five attributes to the API Route

### Requirement 9

**User Story:** As a user, I want the option to upload my photo through the web interface, so that I can get a personalized transformation image if I choose to.

#### Acceptance Criteria

1. WHEN a user completes the five personality questions THEN the Quiz Interface SHALL display an optional image upload step
2. WHEN a user views the image upload step THEN the system SHALL clearly indicate that uploading is optional
3. WHEN a user selects an image file THEN the system SHALL validate that the file is a supported image format
4. WHEN a user uploads an image THEN the system SHALL display a preview of the uploaded photo
5. WHEN a user skips the image upload THEN the system SHALL allow submission without an image
6. WHEN a user submits without an image THEN the Results Page SHALL display the monster assignment without showing transformation imagery
7. WHEN an image is uploaded THEN the system SHALL store the image reference for use in the transformation prompt

### Requirement 10

**User Story:** As a user, I want to see my monster assignment displayed on a results page, so that I can understand my personality match and share it with others.

#### Acceptance Criteria

1. WHEN the API Route returns a monster assignment THEN the Results Page SHALL display the assigned monster name prominently
2. WHEN displaying results THEN the Results Page SHALL show the five-word core trait summary
3. WHEN displaying results THEN the Results Page SHALL present the humorous rationale text
4. WHEN displaying results THEN the Results Page SHALL show the user's uploaded photo alongside the monster assignment
5. WHEN displaying results THEN the Results Page SHALL provide options to restart the quiz or share results

### Requirement 11

**User Story:** As a developer, I want a Next.js API route that processes quiz submissions, so that the frontend can communicate with the ARCANA-ENGINE backend logic.

#### Acceptance Criteria

1. WHEN the Quiz Interface submits data THEN the API Route SHALL receive the five user attributes as a POST request
2. WHEN the API Route receives a request THEN the system SHALL invoke the ARCANA-ENGINE processing pipeline
3. WHEN the processing pipeline completes successfully THEN the API Route SHALL return the JSON response with status code 200
4. WHEN the processing pipeline encounters an error THEN the API Route SHALL return an appropriate error response with status code 400 or 500
5. WHEN the API Route returns a response THEN the system SHALL include proper CORS headers for client-side access

### Requirement 12

**User Story:** As a user, I want the application to have a visually appealing neon-gothic horror aesthetic, so that the experience matches the Halloween monster theme.

#### Acceptance Criteria

1. WHEN a user views any page THEN the application SHALL use a dark color scheme with neon accent colors
2. WHEN displaying UI elements THEN the application SHALL incorporate the electric violet color #8E48FF as a primary accent
3. WHEN rendering text and components THEN the application SHALL use typography that evokes a gothic horror aesthetic
4. WHEN a user interacts with the interface THEN the application SHALL provide smooth transitions and hover effects
5. WHEN displaying the Results Page THEN the application SHALL create an immersive horror-themed visual experience
