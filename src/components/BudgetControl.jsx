import { parseNumberField } from '../state/reducer.js';

export default function BudgetControl({ budget, dispatch, isInvalid }) {
  return (
    <div className="budget-row">
      <label htmlFor="group-budget">Group budget</label>
      <div className="budget-input-group">
        <span>₹</span>
        <input
          id="group-budget"
          value={budget ?? ''}
          inputMode="numeric"
          style={isInvalid ? { color: '#e08a7d' } : undefined}
          onChange={(e) => dispatch({ type: 'SET_BUDGET', value: parseNumberField(e.target.value) })}
        />
      </div>
      <span className="hint">Max price for one serving, per resident &mdash; not multiplied by group size.</span>
    </div>
  );
}
