/**
 * Curriculum.ts — Improved UE5 C++ Training Curriculum
 *
 * KEY IMPROVEMENTS:
 *  1. Bulletproof validation: Strips comments and whitespace to evaluate syntax structurally.
 *  2. Sequential validation: Verifies execution order (e.g., Super::BeginPlay first).
 *  3. UHT Realism: Starter code includes #pragma once and standard includes.
 *  4. Granular Diagnostics: Every rule isolates a single point of failure.
 *  5. Case-Preservation: Handles exact string literal matching for TEXT() macros.
 */

import { UTaskDefinition } from './TrainingCore';

// ---------------------------------------------------------------------------
// Robust Evaluation Helpers
// ---------------------------------------------------------------------------

export const stripComments = (code: string) => code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

export const condense = (code: string) => stripComments(code).replace(/\s+/g, '');

export const hasStr = (code: string, str: string) => stripComments(code).includes(str);

export const hasRegex = (code: string, regex: RegExp) => regex.test(stripComments(code));

// ---------------------------------------------------------------------------
// Curriculum
// ---------------------------------------------------------------------------
export { embeddedTasks } from "./tasks";
