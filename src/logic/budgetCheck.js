/**
 * Budget compatibility rule.
 *
 * "The one group budget is the maximum allowed price for one serving for
 * one resident. A dish passes when its positive whole-rupee price is less
 * than or equal to the budget; do not multiply the price by the group size."
 */

/** Returns true when the dish's price is within (<=) the group budget. */
export function passesBudget(dish, budget) {
  return dish.price <= budget;
}
