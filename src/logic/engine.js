import { validateAll } from './validate.js';
import { computeCompatibility } from './compatibility.js';

/**
 * Single entry point the UI calls when the user triggers the
 * "Check Compatibility" action.
 *
 * On invalid input, returns { validationError, result: null } and the UI
 * must show no compatibility/exclusion rows and clear any earlier counts.
 * On valid input, returns { validationError: null, result }.
 */
export function runCompatibilityCheck({ residents, dishes, budget }) {
  const validationError = validateAll({ residents, dishes, budget });
  if (validationError) {
    return { validationError, result: null };
  }
  const result = computeCompatibility(residents, dishes, budget);
  return { validationError: null, result };
}
