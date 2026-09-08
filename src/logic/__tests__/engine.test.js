import { describe, it, expect } from 'vitest';
import { getBuiltInDataset } from '../../data/seedData.js';
import { runCompatibilityCheck } from '../engine.js';
import { filterCompatibleDishes } from '../search.js';

function freshDataset() {
  // Deep clone so each test can mutate freely without cross-contamination.
  const d = getBuiltInDataset();
  return {
    residents: d.residents.map((r) => ({ ...r, allergens: [...r.allergens] })),
    dishes: d.dishes.map((dish) => ({ ...dish, ingredients: [...dish.ingredients] })),
    budget: d.budget,
  };
}

describe('Built-in compatibility result', () => {
  it('shows exactly D01 then D02 as compatible, with count 2', () => {
    const { residents, dishes, budget } = freshDataset();
    const { validationError, result } = runCompatibilityCheck({ residents, dishes, budget });

    expect(validationError).toBeNull();
    expect(result.compatible.map((d) => d.id)).toEqual(['D01', 'D02']);
    expect(result.compatibleCount).toBe(2);
  });

  it('produces the exact contracted exclusion reasons for D03, D04, D05', () => {
    const { residents, dishes, budget } = freshDataset();
    const { result } = runCompatibilityCheck({ residents, dishes, budget });

    expect(result.exclusions.D03).toEqual(['DIET:Asha', 'ALLERGEN:Mira:MILK']);
    expect(result.exclusions.D04).toEqual(['ALLERGEN:Dev:PEANUT']);
    expect(result.exclusions.D05).toEqual(['DIET:Asha', 'DIET:Dev']);
  });

  it('lets the boundary-priced D02 (₹150) pass a ₹150 budget', () => {
    const { residents, dishes, budget } = freshDataset();
    const { result } = runCompatibilityCheck({ residents, dishes, budget });

    expect(result.compatible.some((d) => d.id === 'D02')).toBe(true);
    expect(result.exclusions.D02).toBeUndefined();
  });
});

describe('Deterministic search narrowing', () => {
  it('narrows to D02 only for query "wheat", count stays 2, and clearing restores both', () => {
    const { residents, dishes, budget } = freshDataset();
    const { result } = runCompatibilityCheck({ residents, dishes, budget });

    const narrowed = filterCompatibleDishes(result.compatible, 'wheat');
    expect(narrowed.map((d) => d.id)).toEqual(['D02']);
    expect(result.compatibleCount).toBe(2); // count is unfiltered

    const cleared = filterCompatibleDishes(result.compatible, '');
    expect(cleared.map((d) => d.id)).toEqual(['D01', 'D02']);
  });

  it('is case-insensitive and trims surrounding whitespace', () => {
    const { residents, dishes, budget } = freshDataset();
    const { result } = runCompatibilityCheck({ residents, dishes, budget });

    const narrowed = filterCompatibleDishes(result.compatible, '  WhEaT  ');
    expect(narrowed.map((d) => d.id)).toEqual(['D02']);
  });

  it('only ever filters the compatible set, never excluded dishes', () => {
    const { residents, dishes, budget } = freshDataset();
    const { result } = runCompatibilityCheck({ residents, dishes, budget });

    // "peanut" matches D04's ingredient tag, but D04 was excluded, so it
    // must never appear even though the substring exists in the full dish list.
    const narrowed = filterCompatibleDishes(result.compatible, 'peanut');
    expect(narrowed).toEqual([]);
  });
});

describe('Budget boundary change', () => {
  it('drops D02 to OVER_BUDGET when the budget becomes ₹130, leaving only D01', () => {
    const { residents, dishes } = freshDataset();
    const { result } = runCompatibilityCheck({ residents, dishes, budget: 130 });

    expect(result.compatible.map((d) => d.id)).toEqual(['D01']);
    expect(result.compatibleCount).toBe(1);
    expect(result.exclusions.D02).toEqual(['OVER_BUDGET']);
  });
});

describe('Invalid price handling', () => {
  it('reports INVALID_INPUT naming the D01 row and price field when price is 0', () => {
    const { residents, dishes, budget } = freshDataset();
    dishes[0].price = 0;

    const { validationError, result } = runCompatibilityCheck({ residents, dishes, budget });

    expect(validationError).toEqual({
      code: 'INVALID_INPUT',
      table: 'DISH',
      row: 'D01',
      field: 'price',
    });
    expect(result).toBeNull();
  });

  it('also rejects negative and non-integer prices', () => {
    const { residents, dishes, budget } = freshDataset();
    dishes[1].price = -5;
    expect(runCompatibilityCheck({ residents, dishes, budget }).validationError.field).toBe('price');

    dishes[1].price = 99.5;
    expect(runCompatibilityCheck({ residents, dishes, budget }).validationError.field).toBe('price');
  });

  it('reports INVALID_INPUT for a blank resident name', () => {
    const { residents, dishes, budget } = freshDataset();
    residents[0].name = '   ';
    const { validationError } = runCompatibilityCheck({ residents, dishes, budget });
    expect(validationError.code).toBe('INVALID_INPUT');
    expect(validationError.table).toBe('GROUP');
    expect(validationError.field).toBe('name');
  });

  it('reports INVALID_INPUT for an invalid resident diet class', () => {
    const { residents, dishes, budget } = freshDataset();
    residents[1].diet = 'PESCATARIAN';
    const { validationError } = runCompatibilityCheck({ residents, dishes, budget });
    expect(validationError).toEqual({
      code: 'INVALID_INPUT',
      table: 'GROUP',
      row: 'Dev',
      field: 'diet',
    });
  });

  it('rejects a dish diet class of NO_RESTRICTION (resident-only value)', () => {
    const { residents, dishes, budget } = freshDataset();
    dishes[0].dietClass = 'NO_RESTRICTION';
    const { validationError } = runCompatibilityCheck({ residents, dishes, budget });
    expect(validationError).toEqual({
      code: 'INVALID_INPUT',
      table: 'DISH',
      row: 'D01',
      field: 'dietClass',
    });
  });

  it('reports DUPLICATE_DISH_ID when two dishes share an id (case/space-insensitive)', () => {
    const { residents, dishes, budget } = freshDataset();
    dishes[1].id = ' d01 ';
    const { validationError, result } = runCompatibilityCheck({ residents, dishes, budget });
    expect(validationError.code).toBe('DUPLICATE_DISH_ID');
    expect(validationError.table).toBe('DISH');
    expect(result).toBeNull();
  });

  it('rejects an invalid budget of 0', () => {
    const { residents, dishes } = freshDataset();
    const { validationError } = runCompatibilityCheck({ residents, dishes, budget: 0 });
    expect(validationError).toEqual({
      code: 'INVALID_INPUT',
      table: 'BUDGET',
      row: 'Group Budget',
      field: 'budget',
    });
  });
});

describe('Reset', () => {
  it('the built-in dataset getter always returns a fresh, valid, deep-cloned copy', () => {
    const a = getBuiltInDataset();
    a.dishes[0].price = 0;
    a.residents[0].allergens.push('X');

    const b = getBuiltInDataset();
    expect(b.dishes[0].price).toBe(110);
    expect(b.residents[0].allergens).toEqual([]);

    const { validationError, result } = runCompatibilityCheck(b);
    expect(validationError).toBeNull();
    expect(result.compatible.map((d) => d.id)).toEqual(['D01', 'D02']);
  });
});
