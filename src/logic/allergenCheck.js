/**
 * Allergen compatibility rule.
 *
 * "A dish fails the allergen rule when any normalized ingredient tag
 * exactly equals any allergen tag of any resident. Treat the supplied
 * ingredient tags as authoritative: do not infer ingredients, aliases,
 * or cross-contamination."
 *
 * Inputs are expected to already be normalized (trimmed + uppercased).
 * Matching is a strict, exact string equality check — no substrings,
 * no synonyms, no fuzzy matching.
 */

/**
 * Returns the list of { resident, tag } matches, in the exact order
 * required for exclusion reasons: residents in table order, and for
 * each resident, matched allergens in the dish's ingredient-tag order.
 */
export function findAllergenMatches(dish, residents) {
  const matches = [];
  for (const resident of residents) {
    const allergenSet = new Set(resident.allergens);
    for (const ingredient of dish.ingredients) {
      if (allergenSet.has(ingredient)) {
        matches.push({ resident, tag: ingredient });
      }
    }
  }
  return matches;
}

/** Returns true when the dish passes the allergen rule for every resident. */
export function passesAllergenRule(dish, residents) {
  return findAllergenMatches(dish, residents).length === 0;
}
