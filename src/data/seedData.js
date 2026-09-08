/**
 * Built-in seed data for the Hostel Food Compatibility Board.
 *
 * This is the ONLY place the contracted built-in dataset is defined.
 * Values are intentionally left in "raw" form (as the problem statement
 * shows them) — normalization (trim + uppercase) happens later in
 * logic/normalize.js, never here. This keeps the seed data a faithful,
 * readable copy of the spec and keeps normalization logic testable
 * in isolation.
 */

export const SEED_BUDGET = 150;

export const SEED_RESIDENTS = [
  { name: 'Asha', diet: 'VEGAN', allergens: [] },
  { name: 'Dev', diet: 'VEGETARIAN', allergens: ['PEANUT'] },
  { name: 'Mira', diet: 'NO_RESTRICTION', allergens: ['MILK'] },
];

export const SEED_DISHES = [
  {
    id: 'D01',
    cafe: 'Hostel Cafe',
    name: 'Lentil Rice Bowl',
    dietClass: 'VEGAN',
    ingredients: ['LENTIL', 'RICE', 'SPINACH'],
    price: 110,
  },
  {
    id: 'D02',
    cafe: 'Library Cafe',
    name: 'Tomato Pasta',
    dietClass: 'VEGAN',
    ingredients: ['WHEAT', 'TOMATO'],
    price: 150,
  },
  {
    id: 'D03',
    cafe: 'Hostel Cafe',
    name: 'Paneer Wrap',
    dietClass: 'VEGETARIAN',
    ingredients: ['MILK', 'WHEAT'],
    price: 140,
  },
  {
    id: 'D04',
    cafe: 'East Cafe',
    name: 'Peanut Noodles',
    dietClass: 'VEGAN',
    ingredients: ['PEANUT', 'WHEAT'],
    price: 130,
  },
  {
    id: 'D05',
    cafe: 'Library Cafe',
    name: 'Egg Sandwich',
    dietClass: 'NON_VEGETARIAN',
    ingredients: ['EGG', 'WHEAT'],
    price: 100,
  },
];

/**
 * Returns a fresh, deep-cloned copy of the built-in dataset so callers
 * (e.g. Reset) never accidentally mutate the shared seed constants.
 */
export function getBuiltInDataset() {
  return {
    budget: SEED_BUDGET,
    residents: SEED_RESIDENTS.map((r) => ({ ...r, allergens: [...r.allergens] })),
    dishes: SEED_DISHES.map((d) => ({ ...d, ingredients: [...d.ingredients] })),
  };
}
