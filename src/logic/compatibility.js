import { normalizeDishes, normalizeResidents } from './normalize.js';
import { passesDietForResident } from './dietCheck.js';
import { findAllergenMatches } from './allergenCheck.js';
import { passesBudget } from './budgetCheck.js';

/**
 * Formats a single exclusion reason into its exact contracted string form:
 *   DIET:<resident>
 *   ALLERGEN:<resident>:<tag>
 *   OVER_BUDGET
 */
export function formatReason(reason) {
  switch (reason.type) {
    case 'DIET':
      return `DIET:${reason.resident}`;
    case 'ALLERGEN':
      return `ALLERGEN:${reason.resident}:${reason.tag}`;
    case 'OVER_BUDGET':
      return 'OVER_BUDGET';
    default:
      throw new Error(`Unknown exclusion reason type: ${reason.type}`);
  }
}

/**
 * Evaluates a single (already-normalized) dish against the (already-
 * normalized) group and budget.
 *
 * Exclusion-reason ordering contract:
 *   "For each resident, emit a diet reason before allergen reasons; order
 *   residents by the resident table, matched allergens by the dish's
 *   ingredient-tag order, and OVER_BUDGET last."
 *
 * Returns { compatible: boolean, reasons: ExclusionReason[] } where
 * reasons is empty iff compatible is true.
 */
export function evaluateDish(dish, residents, budget) {
  const reasons = [];

  for (const resident of residents) {
    if (!passesDietForResident(dish, resident)) {
      reasons.push({ type: 'DIET', resident: resident.name });
    }
    const matches = findAllergenMatches(dish, [resident]);
    for (const match of matches) {
      reasons.push({ type: 'ALLERGEN', resident: resident.name, tag: match.tag });
    }
  }

  if (!passesBudget(dish, budget)) {
    reasons.push({ type: 'OVER_BUDGET' });
  }

  return { compatible: reasons.length === 0, reasons };
}

/**
 * Computes overall compatibility for the whole dish list against the
 * whole resident group and a single budget.
 *
 * Assumes `residents`, `dishes`, and `budget` have already passed
 * validation (see validate.js) — this function does not validate.
 *
 * Returns:
 *   {
 *     compatible: Dish[],                 // in original dish source order
 *     exclusions: { [dishId]: string[] }, // formatted reason strings
 *     compatibleCount: number,
 *   }
 */
export function computeCompatibility(residents, dishes, budget) {
  const normalizedResidents = normalizeResidents(residents);
  const normalizedDishes = normalizeDishes(dishes);

  const compatible = [];
  const exclusions = {};

  normalizedDishes.forEach((normalizedDish, index) => {
    const originalDish = dishes[index];
    const { compatible: isCompatible, reasons } = evaluateDish(
      normalizedDish,
      normalizedResidents,
      budget
    );

    if (isCompatible) {
      compatible.push(originalDish);
    } else {
      exclusions[originalDish.id] = reasons.map(formatReason);
    }
  });

  return {
    compatible,
    exclusions,
    compatibleCount: compatible.length,
  };
}
