import { getBuiltInDataset } from '../data/seedData.js';

export function textToList(text) {
  return String(text ?? '').split(',');
}

export function listToText(list) {
  return (list || []).join(', ');
}

export function parseNumberField(value) {
  if (value === '' || value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

let residentKeySeq = 0;
let dishKeySeq = 0;

function withKeys(dataset) {
  return {
    ...dataset,
    residents: dataset.residents.map((r) => ({ ...r, _key: `r${residentKeySeq++}` })),
    dishes: dataset.dishes.map((d) => ({ ...d, _key: `d${dishKeySeq++}` })),
  };
}

export function makeInitialState() {
  const seed = withKeys(getBuiltInDataset());
  return {
    residents: seed.residents,
    dishes: seed.dishes,
    budget: seed.budget,
    searchQuery: '',
    validationError: null,
    result: null,
  };
}

function clearCalculated(state) {
  return { ...state, validationError: null, result: null };
}

export function boardReducer(state, action) {
  switch (action.type) {
    case 'SET_RESIDENT_FIELD': {
      const { index, field, value } = action;
      const residents = state.residents.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      );
      return clearCalculated({ ...state, residents });
    }

    case 'ADD_RESIDENT': {
      const residents = [
        ...state.residents,
        { _key: `r${residentKeySeq++}`, name: '', diet: 'NO_RESTRICTION', allergens: [] },
      ];
      return clearCalculated({ ...state, residents });
    }

    case 'DELETE_RESIDENT': {
      const residents = state.residents.filter((_, i) => i !== action.index);
      return clearCalculated({ ...state, residents });
    }

    case 'SET_DISH_FIELD': {
      const { index, field, value } = action;
      const dishes = state.dishes.map((d, i) => (i === index ? { ...d, [field]: value } : d));
      return clearCalculated({ ...state, dishes });
    }

    case 'ADD_DISH': {
      const dishes = [
        ...state.dishes,
        {
          _key: `d${dishKeySeq++}`,
          id: '',
          cafe: '',
          name: '',
          dietClass: 'VEGAN',
          ingredients: [],
          price: undefined,
        },
      ];
      return clearCalculated({ ...state, dishes });
    }

    case 'DELETE_DISH': {
      const dishes = state.dishes.filter((_, i) => i !== action.index);
      return clearCalculated({ ...state, dishes });
    }

    case 'SET_BUDGET': {
      return clearCalculated({ ...state, budget: action.value });
    }

    case 'SET_SEARCH': {
      // Search only narrows an already-calculated result; it must never
      // trigger recomputation or clear the result/count.
      return { ...state, searchQuery: action.value };
    }

    case 'SET_VALIDATION_ERROR': {
      return { ...state, validationError: action.error, result: null };
    }

    case 'SET_RESULT': {
      return { ...state, validationError: null, result: action.result };
    }

    case 'RESET': {
      const seed = withKeys(getBuiltInDataset());
      return {
        residents: seed.residents,
        dishes: seed.dishes,
        budget: seed.budget,
        searchQuery: '',
        validationError: null,
        result: null,
      };
    }

    default:
      return state;
  }
}
