import { DIET_CLASSES, DISH_DIET_CLASSES, normalizeTag, normalizeText } from './normalize.js';

/**
 * Validation.
 *
 * Contract summary:
 * - Resident names, dish IDs, cafe names, dish names, and ingredient tags
 *   must be non-empty after trimming.
 * - Dish IDs must be unique.
 * - The budget and every dish price must be positive whole rupee values.
 * - Diet classes must be one of the four valid values; NO_RESTRICTION is
 *   valid for residents only (a dish can never be NO_RESTRICTION).
 * - On invalid input: report INVALID_INPUT with the affected table, row,
 *   and field. A duplicate dish ID reports DUPLICATE_DISH_ID instead,
 *   following the same "clear everything" rule downstream.
 *
 * All functions here are pure and return either `null` (valid) or a
 * ValidationError object: { code, table, row, field }.
 *   - table: 'GROUP' | 'DISH' | 'BUDGET'
 *   - row:   human-readable row identifier (resident name / dish id)
 *   - field: the specific field that failed
 */

export function isPositiveWholeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value) && value > 0;
}

function makeError(code, table, row, field) {
  return { code, table, row, field };
}

/** Validates the single group budget value. */
export function validateBudget(budget) {
  if (!isPositiveWholeNumber(budget)) {
    return makeError('INVALID_INPUT', 'BUDGET', 'Group Budget', 'budget');
  }
  return null;
}

/**
 * Validates one resident record (raw, pre-normalization values expected
 * so we can distinguish "blank" from "trims to blank").
 * `rowLabel` is used for error reporting when the name itself is blank.
 */
export function validateResident(resident, rowLabel) {
  const name = normalizeText(resident?.name);
  const row = name || rowLabel;

  if (name.length === 0) {
    return makeError('INVALID_INPUT', 'GROUP', rowLabel, 'name');
  }

  const diet = normalizeTag(resident?.diet);
  if (!DIET_CLASSES.includes(diet)) {
    return makeError('INVALID_INPUT', 'GROUP', row, 'diet');
  }

  return null;
}

/**
 * Validates one dish record in isolation (does not check uniqueness —
 * see checkDuplicateDishIds for that, which needs the full list).
 */
export function validateDish(dish, rowLabel) {
  const id = normalizeText(dish?.id);
  const row = id || rowLabel;

  if (id.length === 0) {
    return makeError('INVALID_INPUT', 'DISH', rowLabel, 'id');
  }

  const cafe = normalizeText(dish?.cafe);
  if (cafe.length === 0) {
    return makeError('INVALID_INPUT', 'DISH', row, 'cafe');
  }

  const name = normalizeText(dish?.name);
  if (name.length === 0) {
    return makeError('INVALID_INPUT', 'DISH', row, 'name');
  }

  const dietClass = normalizeTag(dish?.dietClass);
  if (!DISH_DIET_CLASSES.includes(dietClass)) {
    return makeError('INVALID_INPUT', 'DISH', row, 'dietClass');
  }

  const ingredients = Array.isArray(dish?.ingredients) ? dish.ingredients : [];
  if (ingredients.length === 0) {
    return makeError('INVALID_INPUT', 'DISH', row, 'ingredients');
  }
  for (const tag of ingredients) {
    if (normalizeText(tag).length === 0) {
      return makeError('INVALID_INPUT', 'DISH', row, 'ingredients');
    }
  }

  if (!isPositiveWholeNumber(dish?.price)) {
    return makeError('INVALID_INPUT', 'DISH', row, 'price');
  }

  return null;
}

/** Checks for duplicate dish IDs (case/space-insensitive, per normalization rules). */
export function checkDuplicateDishIds(dishes) {
  const seen = new Set();
  for (const dish of dishes || []) {
    const id = normalizeTag(dish?.id);
    if (id.length === 0) continue; // blank IDs are reported by validateDish instead
    if (seen.has(id)) {
      return makeError('DUPLICATE_DISH_ID', 'DISH', normalizeText(dish?.id), 'id');
    }
    seen.add(id);
  }
  return null;
}

/**
 * Runs every validation rule in a fixed, deterministic order and returns
 * the first failure found, or null if everything is valid.
 *
 * Order: budget -> residents (table order) -> dish ID duplicates ->
 *        dishes (table order, per-field order inside validateDish).
 */
export function validateAll({ residents, dishes, budget }) {
  const budgetError = validateBudget(budget);
  if (budgetError) return budgetError;

  for (let i = 0; i < (residents || []).length; i += 1) {
    const error = validateResident(residents[i], `Row ${i + 1}`);
    if (error) return error;
  }

  const duplicateError = checkDuplicateDishIds(dishes);
  if (duplicateError) return duplicateError;

  for (let i = 0; i < (dishes || []).length; i += 1) {
    const error = validateDish(dishes[i], `Row ${i + 1}`);
    if (error) return error;
  }

  return null;
}
