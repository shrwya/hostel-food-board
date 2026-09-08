/**
 * Diet compatibility rule.
 *
 * - A VEGAN resident accepts only a VEGAN dish.
 * - A VEGETARIAN resident accepts VEGAN or VEGETARIAN.
 * - A NO_RESTRICTION resident accepts any dish class.
 * (NON_VEGETARIAN residents are not part of this dataset's valid resident
 * diets per the contract, but the rule generalizes: a NON_VEGETARIAN
 * resident accepts any dish, since every dish class is either vegan,
 * vegetarian, or non-vegetarian.)
 *
 * Inputs are expected to already be normalized (trimmed + uppercased).
 */

const ACCEPTS = {
  VEGAN: new Set(['VEGAN']),
  VEGETARIAN: new Set(['VEGAN', 'VEGETARIAN']),
  NON_VEGETARIAN: new Set(['VEGAN', 'VEGETARIAN', 'NON_VEGETARIAN']),
  NO_RESTRICTION: new Set(['VEGAN', 'VEGETARIAN', 'NON_VEGETARIAN']),
};

/**
 * Returns true if `residentDiet` accepts a dish of `dishDietClass`.
 * Both arguments must already be normalized (uppercase, trimmed).
 */
export function dietAccepts(residentDiet, dishDietClass) {
  const accepted = ACCEPTS[residentDiet];
  if (!accepted) return false;
  return accepted.has(dishDietClass);
}

/**
 * Checks a single normalized dish against a single normalized resident.
 * Returns true when the dish passes the diet rule for that resident.
 */
export function passesDietForResident(dish, resident) {
  return dietAccepts(resident.diet, dish.dietClass);
}

/**
 * Returns the list of normalized residents (in table order) for whom the
 * dish FAILS the diet rule. Used to build DIET:<resident> exclusion reasons.
 */
export function residentsFailingDiet(dish, residents) {
  return residents.filter((resident) => !passesDietForResident(dish, resident));
}
