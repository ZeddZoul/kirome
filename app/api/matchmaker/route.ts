/**
 * Monster Matchmaker API Route
 * POST /api/matchmaker
 * * Receives quiz submissions and returns monster assignments using Gemini AI
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/**
 * Request body interface for matchmaker API
 */
interface MatchmakerRequest {
  timeOfDay?: string;
  weather?: string;
  conflictStyle?: string;
  snackFlavor?: string;
  ambition?: string;
  imageData?: string; // Base64 encoded image (optional)
}

/**
 * Error response interface
 */
interface ErrorResponse {
  error: string;
  details?: string;
}

// Define the exact structure the AI should return
interface AssignmentResult {
  assigned_persona: string;
  rationale: string;
  core_trait_summary: string;
}
interface OutputData {
  assignment_result: AssignmentResult;
  image_generation_prompt: string;
  share_message: string;
  transformed_image?: string;
}

/**
 * POST handler for monster matchmaker using Gemini AI
 * Requirement 11.1: Receives five user attributes as POST request
 * Requirement 11.2: Uses Gemini AI to generate monster assignment
 * Requirement 11.3: Returns JSON response with status 200 on success
 * Requirement 11.4: Returns error response with status 400/500 on failure
 * Requirement 11.5: Includes proper CORS headers
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: MatchmakerRequest;
    try {
      body = await request.json() as MatchmakerRequest;
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON in request body',
          details: error instanceof Error ? error.message : 'Failed to parse JSON'
        } as ErrorResponse,
        { 
          status: 400,
          headers: getCORSHeaders()
        }
      );
    }

    // Validate required fields
    if (!body.timeOfDay || !body.weather || !body.conflictStyle || !body.snackFlavor || !body.ambition) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: 'All five personality attributes are required'
        } as ErrorResponse,
        {
          status: 400,
          headers: getCORSHeaders()
        }
      );
    }

    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json(
        {
          error: 'Server configuration error',
          details: 'AI service not configured'
        } as ErrorResponse,
        {
          status: 500,
          headers: getCORSHeaders()
        }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // STEP 1: Use gemini-2.5-flash for persona assignment (text only)
    const personaPrompt = `You are Kiroween Kinship v7.2, a monster personality matchmaker. Based on the user's personality attributes, assign them to ONE of these 15 monster personas:

1. Vampire: aristocratic, immortal, nocturnal, sophisticated, ancient
2. Werewolf: primal rage, chaotic, transformative, passionate, wild
3. Cthulhu: insanity-inducing, ancient, unknowable, cosmic, dread
4. Frankenstein's Monster: misunderstood, constructed, lonely, searching, strong
5. Mummy: cursed, vengeful, eternal, wrapped, entombed
6. Zombie: mindless, relentless, contagious, hungry, shambling
7. Banshee: sorrowful, loud, prophetic, ethereal, wailing
8. Witch: cunning, mystical, powerful, herbology, secretive
9. Headless Horseman: spectral, seeking lost, swift, determined, rider
10. Cryptid: mysterious, prophetic, elusive, folklore, unseen
11. Grim Reaper: inevitable, neutral, finality, silent, collector
12. Poltergeist: invisible, destructive, mischievous, noisy, energetic
13. Demogorgon: interdimensional hunter, primal, terrifying, predator, gate-opener
14. Alien Parasite: infiltrating, subtle, control, hidden, symbiotic
15. Gorgon: stone gaze, transformative, deadly, beautiful, serpentine

You SHOULD pick the persona outside this list if the user's personality traits do not FULLY match any of the ones here or YOU ASCERTAIN there is a BETTER fit for the User's PERSONALITY ATTRIBUTES.

User's Personality Attributes:
- Time of Day: ${body.timeOfDay}
- Weather: ${body.weather}
- Conflict Style: ${body.conflictStyle} (DOUBLE WEIGHTED - very important!)
- Snack Flavor: ${body.snackFlavor}
- Ambition: ${body.ambition} (DOUBLE WEIGHTED - very important!)

Return ONLY a JSON object in this exact format (do NOT use markdown code fences like \`\`\`json, and no extra text outside the JSON):
{
  "assignment_result": {
    "assigned_persona": "[Monster Name]",
    "rationale": "[2-3 humorous sentences explaining why, max 50 words, must reference conflict style and ambition]",
    "core_trait_summary": "[exactly 5 traits from the list above (or what you inferred), comma-separated]"
  },
  "image_generation_prompt": "Transform this person into a [Monster Name] with NEON-GOTHIC HORROR style, electric violet (#8E48FF) lighting, foggy city street background, photorealistic, 8k, cinematic",
  "share_message": "[A fun social media message (2-3 sentences with emojis) announcing their monster persona and encouraging others to try the quiz. Max 200 characters.]"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: personaPrompt,
    });
    console.log('Gemini persona response:', JSON.stringify(response, null, 2));
    const text = response.text;

    // Parse the JSON response
    let outputData: OutputData;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text!.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      outputData = JSON.parse(cleanedText) as OutputData;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return NextResponse.json(
        {
          error: 'AI response parsing failed',
          details: 'Could not parse monster assignment'
        } as ErrorResponse,
        {
          status: 500,
          headers: getCORSHeaders()
        }
      );
    }

    // STEP 2: If image was uploaded, use gemini-2.5-flash-image for transformation
    if (body.imageData) {
      try {
        // Extract base64 data and mime type from data URL
        const matches = body.imageData.match(/^data:([^;]+);base64,(.+)$/);
        
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          
          // Build prompt with text and image (text-and-image-to-image)
          const imagePrompt = [
            { 
              text: `Transform this person into a ${outputData.assignment_result.assigned_persona}. 

CRITICAL REQUIREMENTS:
- PRESERVE the person's exact facial features, face shape, skin tone, and body proportions - the result must clearly RESEMBLE the original person
- Keep their eyes, nose, mouth, and facial structure identical
- Maintain their body type and posture
- You MAY freely change: clothing, accessories, limbs/hands appearance, hair style/color, background, and add monster-specific features

STYLE: Hyper-realistic, photorealistic quality, 8K resolution, cinematic lighting with electric violet (#8E48FF) neon accents, foggy atmospheric background, dramatic shadows

MONSTER TRANSFORMATION: Add ${outputData.assignment_result.assigned_persona}-specific features (fangs, claws, glowing eyes, supernatural elements) while keeping the person's identity clearly recognizable. The viewer should immediately see this is the SAME PERSON transformed into a monster.` 
            },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ];

          const imageResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', // Correct model for image generation/editing
            contents: imagePrompt,
            config: {
              // Ensure we request an image output
              responseModalities: ['image', 'text'],
            },
          });
          console.log('Image transformation response received');

          // Look for the generated image part
          const parts = imageResponse.candidates?.[0]?.content?.parts;
          if (parts) {
            const imagePart = parts.find((part) => part.inlineData);
            if (imagePart?.inlineData) {
              const generatedImageData = imagePart.inlineData.data;
              // Default to 'image/png' if mimeType is somehow missing
              const imageMimeType = imagePart.inlineData.mimeType || 'image/png';
              outputData.transformed_image = `data:${imageMimeType};base64,${generatedImageData}`;
            }
          }
          
        }
      } catch (transformError) {
        console.error('Image transformation error:', transformError);
        // Requirement 11.4 handling: Log the error but continue execution.
        // The persona assignment is the primary result, so we proceed without the image.
        // If this were a critical failure, we'd re-throw, but for an optional feature, logging is sufficient.
      }
    }

    // Requirement 11.3: Return successful JSON response with status 200
    // Requirement 11.5: Include proper CORS headers
    return NextResponse.json(
      outputData,
      {
        status: 200,
        headers: getCORSHeaders()
      }
    );

  } catch (error) {
    // Requirement 11.4: Handle unexpected errors with status 500
    console.error('Unexpected error in matchmaker API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      } as ErrorResponse,
      {
        status: 500,
        headers: getCORSHeaders()
      }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 * Requirement 11.5: Support CORS for client-side access
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCORSHeaders()
  });
}

/**
 * Helper function to generate CORS headers
 * Requirement 11.5: Include proper CORS headers for client-side access
 */
function getCORSHeaders(): Headers {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  headers.set('Content-Type', 'application/json');
  return headers;
}