// @ts-ignore
@external("env", "Date.now")
declare function Date_now(): i64;

/**
 * The core agent logic. It embodies the agent's "understanding" and
 * decision-making process, derived conceptually from the CUE Lexicon.
 *
 * It applies simple, verifiable rules to determine the correct HVAC action.
 *
 * @param currentTemp The current temperature reading (f32).
 * @param desiredTemp The desired temperature from the policy (f32).
 * @param tolerance The tolerance from the policy (f32).
 * @returns An integer representing the HVAC command:
 * * 1 for HEAT
 * * 2 for COOL
 * * 0 for OFF/No Action
 */
export function decideHVACAction(
  currentTemp: f32,
  desiredTemp: f32,
  tolerance: f32
): i32 {
  // This logic is a practical implementation of a "Harmonic Template"
  // derived from the CUE Lexicon's axiomatic pillar (Principia Mathematica).
  // It represents a simple, verifiable conditional protocol.

  // Agent's "understanding" of the goal: maintain temperature within a range.
  const upperThreshold = desiredTemp + tolerance;
  const lowerThreshold = desiredTemp - tolerance;

  let command: i32 = 0; // Default: 0 (OFF / No Action)

  // IF (currentTemp > upperThreshold) THEN (command = "COOL")
  if (currentTemp > upperThreshold) {
    command = 2; // COOL
  }
  // ELSE IF (currentTemp < lowerThreshold) THEN (command = "HEAT")
  else if (currentTemp < lowerThreshold) {
    command = 1; // HEAT
  }

  // Return the determined command code.
  return command;
}