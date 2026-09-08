import { normalizeText } from './normalize.js';

/**
 * Search rule:
 * "Trim and compare the search query case-insensitively as a substring of
 * the compatible dish's cafe, dish name, or any ingredient tag. Apply it
 * only to compatible dishes. An empty query displays all compatible
 * dishes, and the overall compatible count remains based on the
 * unfiltered result."
 *
 * This function only narrows an already-computed `compatibleDishes` list;
 * it never touches the compatible count, and it is never applied to
 * excluded dishes.
 */
export function filterCompatibleDishes(compatibleDishes, rawQuery) {
  const query = normalizeText(rawQuery).toLowerCase();
  if (query.length === 0) return compatibleDishes;

  return compatibleDishes.filter((dish) => {
    const haystacks = [dish.cafe, dish.name, ...dish.ingredients];
    return haystacks.some((value) => String(value).toLowerCase().includes(query));
  });
}
