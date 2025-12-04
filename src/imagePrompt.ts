/**
 * Image Prompt Builder - Constructs image generation prompts for monster transformations
 */

import { MonsterPersona } from './types';

/**
 * Builds an image generation prompt for transforming a user's photo into their assigned monster
 * 
 * @param monster - The assigned monster persona
 * @returns A formatted image generation prompt string
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */
export function buildImagePrompt(monster: MonsterPersona): string {
  const elements = [
    // 4.1: Source image reference
    'Transform the source image into',
    // Monster name
    `a ${monster.name}`,
    // 4.2: Neon-gothic horror aesthetic style
    'in a neon-gothic horror aesthetic style,',
    // 4.3: Electric violet lighting with color code
    'with electric violet lighting (#8E48FF),',
    // 4.4: Foggy city street background
    'set against a foggy city street background.',
    // 4.5: Technical quality descriptors
    'Photorealistic, 8k resolution, cinematic volumetric lighting.'
  ];

  return elements.join(' ');
}
