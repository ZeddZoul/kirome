#!/usr/bin/env node
/**
 * CLI Interface for Monster Matchmaker
 * Provides command-line interface for testing the monster assignment system
 */

import { processPipeline } from './pipeline';
import { UserInput } from './types';

/**
 * Main function that accepts user input and returns JSON output
 * 
 * @param input - User input object (can be partial for validation testing)
 * @returns JSON string output or error message
 * 
 * Requirements: 1.1, 3.1
 */
export function main(input: Partial<UserInput>): string {
  const result = processPipeline(input);
  
  if (result.success) {
    return result.value;
  } else {
    // Return error as JSON for consistency
    return JSON.stringify({
      error: result.error
    });
  }
}

/**
 * CLI entry point - reads from command line arguments or stdin
 */
function cli(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: monster-matchmaker <json-input>');
    console.error('');
    console.error('Example:');
    console.error('  monster-matchmaker \'{"timeOfDay":"night","weather":"stormy","conflictStyle":"direct","snackFlavor":"salty","ambition":"power"}\'');
    console.error('');
    console.error('Or pipe JSON input:');
    console.error('  echo \'{"timeOfDay":"dawn",...}\' | monster-matchmaker');
    process.exit(1);
  }
  
  try {
    const inputJson = args[0];
    const input = JSON.parse(inputJson);
    const output = main(input);
    console.log(output);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({
      error: `Failed to process input: ${errorMessage}`
    }));
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  cli();
}
