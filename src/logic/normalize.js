/**
 * Normalization utilities.
 *
 * Contract: "Normalize diet classes, ingredient tags, and allergen tags by
 * trimming surrounding spaces and converting them to uppercase."
 *
 * These functions are intentionally dumb and side-effect free: they do not
 * validate (see validate.js) — they only reshape a raw value into its
 * canonical comparable form. Validation decides whether a normalized value
 * is acceptable; normalization just makes comparisons consistent.
 */

export const DIET_CLASSES = Object.freeze([
  'VEGAN',
  'VEGETARIAN',
  'NON_VEGETARIAN',
  'NO_RESTRICTION',
]);

// Diet classes a dish may legally carry (NO_RESTRICTION is resident-only).
export const DISH_DIET_CLASSES = Object.freeze([
  'VEGAN',
  'VEGETARIAN',
  'NON_VEGETARIAN',
]);

/** Trim a raw string. Returns '' for null/undefined/non-string input. */
export function normalizeText(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

/** Trim + uppercase a single tag-like value (diet class, ingredient, allergen). */
export function normalizeTag(value) {
  if (typeof value !== 'string') return '';
  return value.trim().toUpperCase();
}

/** Normalize an array of tag-like values, dropping any that become empty. */
export function normalizeTagList(values) {
  if (!Array.isArray(values)) return [];
  return values.map(normalizeTag).filter((tag) => tag.length > 0);
}

/** Normalize a whole resident record. Does not validate — see validate.js. */
export function normalizeResident(resident) {
  return {
    name: normalizeText(resident?.name),
    diet: normalizeTag(resident?.diet),
    allergens: normalizeTagList(resident?.allergens),
  };
}

/** Normalize a whole dish record. Does not validate — see validate.js. */
export function normalizeDish(dish) {
  return {
    id: normalizeText(dish?.id),
    cafe: normalizeText(dish?.cafe),
    name: normalizeText(dish?.name),
    dietClass: normalizeTag(dish?.dietClass),
    ingredients: normalizeTagList(dish?.ingredients),
    price: dish?.price,
  };
}

export function normalizeResidents(residents) {
  return (residents || []).map(normalizeResident);
}

export function normalizeDishes(dishes) {
  return (dishes || []).map(normalizeDish);
}
