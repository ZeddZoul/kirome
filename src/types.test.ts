/**
 * Basic test to verify Jest and fast-check setup
 */

import * as fc from 'fast-check';
import { UserInput, ValidationResult, Result } from './types';

describe('Testing Framework Setup', () => {
  test('Jest is working correctly', () => {
    expect(true).toBe(true);
  });

  test('fast-check is working correctly', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n + 0 === n;
      }),
      { numRuns: 100 }
    );
  });

  test('TypeScript types are properly defined', () => {
    const input: UserInput = {
      timeOfDay: 'night',
      weather: 'stormy',
      conflictStyle: 'direct',
      snackFlavor: 'sweet',
      ambition: 'power'
    };

    expect(input.timeOfDay).toBe('night');
    expect(input.conflictStyle).toBe('direct');
  });

  test('Result type works correctly', () => {
    const successResult: Result<number> = {
      success: true,
      value: 42
    };

    const errorResult: Result<number> = {
      success: false,
      error: 'Something went wrong'
    };

    expect(successResult.success).toBe(true);
    if (successResult.success) {
      expect(successResult.value).toBe(42);
    }

    expect(errorResult.success).toBe(false);
    if (!errorResult.success) {
      expect(errorResult.error).toBe('Something went wrong');
    }
  });
});
