import { listToText, parseNumberField, textToList } from '../state/reducer.js';

const DISH_DIETS = ['VEGAN', 'VEGETARIAN', 'NON_VEGETARIAN'];

function rowLabel(dish, index) {
  return dish.id.trim() || `Row ${index + 1}`;
}

function isInvalid(validationError, dish, index, field) {
  if (!validationError || validationError.table !== 'DISH') return false;
  if (validationError.code === 'DUPLICATE_DISH_ID') {
    return field === 'id' && validationError.row === dish.id.trim();
  }
  return validationError.row === rowLabel(dish, index) && validationError.field === field;
}

export default function DishTable({ dishes, validationError, dispatch }) {
  return (
    <div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 70 }}>ID</th>
              <th>Cafe</th>
              <th>Dish</th>
              <th style={{ width: '16%' }}>Diet class</th>
              <th>Ingredients</th>
              <th style={{ width: 110 }}>Price (₹)</th>
              <th style={{ width: 90 }}></th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish, index) => (
              <tr key={dish._key}>
                <td>
                  <input
                    className={`cell-input ${isInvalid(validationError, dish, index, 'id') ? 'cell-input--invalid' : ''}`}
                    value={dish.id}
                    placeholder="D0x"
                    onChange={(e) =>
                      dispatch({ type: 'SET_DISH_FIELD', index, field: 'id', value: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    className={`cell-input ${isInvalid(validationError, dish, index, 'cafe') ? 'cell-input--invalid' : ''}`}
                    value={dish.cafe}
                    placeholder="Cafe"
                    onChange={(e) =>
                      dispatch({ type: 'SET_DISH_FIELD', index, field: 'cafe', value: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    className={`cell-input ${isInvalid(validationError, dish, index, 'name') ? 'cell-input--invalid' : ''}`}
                    value={dish.name}
                    placeholder="Dish name"
                    onChange={(e) =>
                      dispatch({ type: 'SET_DISH_FIELD', index, field: 'name', value: e.target.value })
                    }
                  />
                </td>
                <td>
                  <select
                    className={`cell-input cell-input--select ${isInvalid(validationError, dish, index, 'dietClass') ? 'cell-input--invalid' : ''}`}
                    value={dish.dietClass}
                    onChange={(e) =>
                      dispatch({ type: 'SET_DISH_FIELD', index, field: 'dietClass', value: e.target.value })
                    }
                  >
                    {DISH_DIETS.map((d) => (
                      <option key={d} value={d}>
                        {d.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className={`cell-input ${isInvalid(validationError, dish, index, 'ingredients') ? 'cell-input--invalid' : ''}`}
                    value={listToText(dish.ingredients)}
                    placeholder="WHEAT, MILK"
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_DISH_FIELD',
                        index,
                        field: 'ingredients',
                        value: textToList(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className={`cell-input cell-input--num ${isInvalid(validationError, dish, index, 'price') ? 'cell-input--invalid' : ''}`}
                    value={dish.price ?? ''}
                    inputMode="numeric"
                    placeholder="0"
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_DISH_FIELD',
                        index,
                        field: 'price',
                        value: parseNumberField(e.target.value),
                      })
                    }
                  />
                </td>
                <td className="table-row-actions">
                  <button
                    type="button"
                    className="btn-text-danger"
                    onClick={() => dispatch({ type: 'DELETE_DISH', index })}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-toolbar">
        <button type="button" className="link-btn" onClick={() => dispatch({ type: 'ADD_DISH' })}>
          + Add dish
        </button>
      </div>
    </div>
  );
}
