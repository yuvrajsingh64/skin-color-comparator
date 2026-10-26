import type { SkinAnalysisResult, ComparisonResult } from '../types';

/**
 * Calculate the relative measured-lightness difference between two skin analysis results.
 *
 * Uses the lower positive L* value as the denominator:
 *   percentage = ((higher - lower) / lower) * 100
 *
 * The L* values come from the CIELAB color space and represent perceptual lightness
 * in the measured image, NOT objective skin tone or beauty.
 */
export function calculateComparison(
  personA: SkinAnalysisResult,
  personB: SkinAnalysisResult
): ComparisonResult {
  const LA = personA.medianLAB.L;
  const LB = personB.medianLAB.L;

  // Case 3: Both values are equal (within floating point tolerance)
  if (Math.abs(LA - LB) < 0.005) {
    return {
      personA,
      personB,
      lighterPerson: 'equal',
      percentageDifference: 0,
      canCalculatePercentage: true,
      explanation: 'Both sampled regions have the same measured L* lightness.',
    };
  }

  const higher = Math.max(LA, LB);
  const lower = Math.min(LA, LB);
  const lighterPerson: 'A' | 'B' = LA > LB ? 'A' : 'B';

  // Case 4: Denominator is zero or too close to zero
  if (lower < 0.01) {
    return {
      personA,
      personB,
      lighterPerson,
      percentageDifference: 0,
      canCalculatePercentage: false,
      explanation: `The relative percentage cannot be calculated reliably because Person ${lighterPerson === 'A' ? 'B' : 'A'}'s measured L* value (${lower.toFixed(1)}) is too close to zero.`,
    };
  }

  // Cases 1 & 2: Normal calculation
  const percentageDifference = ((higher - lower) / lower) * 100;

  const lighterName = `Person ${lighterPerson}`;
  const darkerName = `Person ${lighterPerson === 'A' ? 'B' : 'A'}`;

  return {
    personA,
    personB,
    lighterPerson,
    percentageDifference,
    canCalculatePercentage: true,
    explanation: `${lighterName}'s sampled skin region has ${percentageDifference.toFixed(1)}% higher measured lightness than ${darkerName}'s.`,
  };
}

/**
 * Format a percentage to one decimal place for display.
 */
export function formatPercentage(value: number): string {
  return value.toFixed(1);
}
