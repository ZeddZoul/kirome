/**
 * Integration tests for Monster Matchmaker API Route
 * Tests the POST /api/matchmaker endpoint
 */

import { POST, OPTIONS } from './route';
import { NextRequest } from 'next/server';
import { OutputJSON } from '../../../src/types';

/**
 * Error response type
 */
interface ErrorResponse {
  error: string;
  details?: string;
}

/**
 * Helper function to create a mock NextRequest
 */
function createMockRequest(body: any, method: string = 'POST'): NextRequest {
  const url = 'http://localhost:3000/api/matchmaker';
  const request = new NextRequest(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return request;
}

describe('POST /api/matchmaker', () => {
  describe('Successful quiz submissions', () => {
    it('should return 200 with valid JSON for complete valid input', async () => {
      const validInput = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: 'direct confrontation',
        snackFlavor: 'savory',
        ambition: 'world domination'
      };

      const request = createMockRequest(validInput);
      const response = await POST(request);

      expect(response.status).toBe(200);

      const data = await response.json() as OutputJSON;
      expect(data).toHaveProperty('assignment_result');
      expect(data.assignment_result).toHaveProperty('assigned_persona');
      expect(data.assignment_result).toHaveProperty('rationale');
      expect(data.assignment_result).toHaveProperty('core_trait_summary');
      expect(data).toHaveProperty('image_generation_prompt');
    });

    it('should return valid monster assignment for different input combinations', async () => {
      const validInput = {
        timeOfDay: 'dawn',
        weather: 'foggy',
        conflictStyle: 'avoidance',
        snackFlavor: 'sweet',
        ambition: 'peaceful existence'
      };

      const request = createMockRequest(validInput);
      const response = await POST(request);

      expect(response.status).toBe(200);

      const data = await response.json() as OutputJSON;
      expect(typeof data.assignment_result.assigned_persona).toBe('string');
      expect(data.assignment_result.assigned_persona.length).toBeGreaterThan(0);
      expect(typeof data.assignment_result.rationale).toBe('string');
      expect(typeof data.assignment_result.core_trait_summary).toBe('string');
      expect(typeof data.image_generation_prompt).toBe('string');
    });

    it('should handle optional imageData field', async () => {
      const validInput = {
        timeOfDay: 'midnight',
        weather: 'clear',
        conflictStyle: 'strategic',
        snackFlavor: 'bitter',
        ambition: 'knowledge',
        imageData: 'base64encodedimagedata...'
      };

      const request = createMockRequest(validInput);
      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json() as OutputJSON;
      expect(data).toHaveProperty('assignment_result');
    });
  });

  describe('Invalid input handling', () => {
    it('should return 400 for missing attributes', async () => {
      const invalidInput = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: 'direct'
        // Missing snackFlavor and ambition
      };

      const request = createMockRequest(invalidInput);
      const response = await POST(request);

      expect(response.status).toBe(400);

      const data = await response.json() as ErrorResponse;
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('details');
      expect(typeof data.error).toBe('string');
    });

    it('should return 400 for completely empty input', async () => {
      const invalidInput = {};

      const request = createMockRequest(invalidInput);
      const response = await POST(request);

      expect(response.status).toBe(400);

      const data = await response.json() as ErrorResponse;
      expect(data).toHaveProperty('error');
      expect(data.error).toBeTruthy();
    });

    it('should return 400 for input with null values', async () => {
      const invalidInput = {
        timeOfDay: null,
        weather: 'stormy',
        conflictStyle: 'direct',
        snackFlavor: 'sweet',
        ambition: 'power'
      };

      const request = createMockRequest(invalidInput);
      const response = await POST(request);

      expect(response.status).toBe(400);

      const data = await response.json() as ErrorResponse;
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for invalid JSON', async () => {
      const url = 'http://localhost:3000/api/matchmaker';
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json {{{',
      });

      const response = await POST(request);

      expect(response.status).toBe(400);

      const data = await response.json() as ErrorResponse;
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Invalid JSON');
    });
  });

  describe('CORS headers', () => {
    it('should include CORS headers in successful responses', async () => {
      const validInput = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: 'direct',
        snackFlavor: 'savory',
        ambition: 'power'
      };

      const request = createMockRequest(validInput);
      const response = await POST(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Content-Type');
      expect(response.headers.get('Content-Type')).toContain('application/json');
    });

    it('should include CORS headers in error responses', async () => {
      const invalidInput = {
        timeOfDay: 'night'
        // Missing other required fields
      };

      const request = createMockRequest(invalidInput);
      const response = await POST(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(response.headers.get('Content-Type')).toContain('application/json');
    });

    it('should handle OPTIONS preflight requests', async () => {
      const url = 'http://localhost:3000/api/matchmaker';
      const request = new NextRequest(url, {
        method: 'OPTIONS',
      });

      const response = await OPTIONS(request);

      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('OPTIONS');
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Content-Type');
    });
  });

  describe('Response structure validation', () => {
    it('should return properly structured assignment_result', async () => {
      const validInput = {
        timeOfDay: 'dusk',
        weather: 'rainy',
        conflictStyle: 'passive-aggressive',
        snackFlavor: 'sour',
        ambition: 'revenge'
      };

      const request = createMockRequest(validInput);
      const response = await POST(request);
      const data = await response.json() as OutputJSON;

      expect(data.assignment_result).toBeDefined();
      expect(typeof data.assignment_result.assigned_persona).toBe('string');
      expect(typeof data.assignment_result.rationale).toBe('string');
      expect(typeof data.assignment_result.core_trait_summary).toBe('string');
      
      // Verify rationale is not empty and within word limit
      const rationaleWords = data.assignment_result.rationale.trim().split(/\s+/);
      expect(rationaleWords.length).toBeGreaterThan(0);
      expect(rationaleWords.length).toBeLessThanOrEqual(50);
    });

    it('should return valid image_generation_prompt', async () => {
      const validInput = {
        timeOfDay: 'night',
        weather: 'stormy',
        conflictStyle: 'direct',
        snackFlavor: 'savory',
        ambition: 'power'
      };

      const request = createMockRequest(validInput);
      const response = await POST(request);
      const data = await response.json() as OutputJSON;

      expect(typeof data.image_generation_prompt).toBe('string');
      expect(data.image_generation_prompt.length).toBeGreaterThan(0);
      
      // Verify prompt contains required elements
      expect(data.image_generation_prompt).toContain('#8E48FF');
      expect(data.image_generation_prompt.toLowerCase()).toContain('neon');
      expect(data.image_generation_prompt.toLowerCase()).toContain('gothic');
    });
  });
});
