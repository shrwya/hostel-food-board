import { listToText, textToList } from '../state/reducer.js';

const RESIDENT_DIETS = ['VEGAN', 'VEGETARIAN', 'NON_VEGETARIAN', 'NO_RESTRICTION'];

function rowLabel(resident, index) {
  return resident.name.trim() || `Row ${index + 1}`;
}

function isInvalid(validationError, resident, index, field) {
  if (!validationError || validationError.table !== 'GROUP') return false;
  return validationError.row === rowLabel(resident, index) && validationError.field === field;
}

export default function GroupTable({ residents, validationError, dispatch }) {
  return (
    <div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '26%' }}>Resident</th>
              <th style={{ width: '24%' }}>Diet</th>
              <th>Allergens</th>
              <th style={{ width: 90 }}></th>
            </tr>
          </thead>
          <tbody>
            {residents.map((resident, index) => (
              <tr key={resident._key}>
                <td>
                  <input
                    className={`cell-input ${isInvalid(validationError, resident, index, 'name') ? 'cell-input--invalid' : ''}`}
                    value={resident.name}
                    placeholder="Name"
                    onChange={(e) =>
                      dispatch({ type: 'SET_RESIDENT_FIELD', index, field: 'name', value: e.target.value })
                    }
                  />
                </td>
                <td>
                  <select
                    className={`cell-input cell-input--select ${isInvalid(validationError, resident, index, 'diet') ? 'cell-input--invalid' : ''}`}
                    value={resident.diet}
                    onChange={(e) =>
                      dispatch({ type: 'SET_RESIDENT_FIELD', index, field: 'diet', value: e.target.value })
                    }
                  >
                    {RESIDENT_DIETS.map((d) => (
                      <option key={d} value={d}>
                        {d.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="cell-input"
                    value={listToText(resident.allergens)}
                    placeholder="none"
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_RESIDENT_FIELD',
                        index,
                        field: 'allergens',
                        value: textToList(e.target.value),
                      })
                    }
                  />
                </td>
                <td className="table-row-actions">
                  <button
                    type="button"
                    className="btn-text-danger"
                    onClick={() => dispatch({ type: 'DELETE_RESIDENT', index })}
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
        <button type="button" className="link-btn" onClick={() => dispatch({ type: 'ADD_RESIDENT' })}>
          + Add resident
        </button>
      </div>
    </div>
  );
}
