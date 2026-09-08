import { useReducer } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ValidationBanner from './components/ValidationBanner.jsx';
import GroupTable from './components/GroupTable.jsx';
import DishTable from './components/DishTable.jsx';
import BudgetControl from './components/BudgetControl.jsx';
import ResultsSection from './components/ResultsSection.jsx';
import { boardReducer, makeInitialState } from './state/reducer.js';
import { runCompatibilityCheck } from './logic/engine.js';

export default function App() {
  const [state, dispatch] = useReducer(boardReducer, undefined, makeInitialState);

  function handleCheck() {
    const { validationError, result } = runCompatibilityCheck({
      residents: state.residents,
      dishes: state.dishes,
      budget: state.budget,
    });

    if (validationError) {
      dispatch({ type: 'SET_VALIDATION_ERROR', error: validationError });
    } else {
      dispatch({ type: 'SET_RESULT', result });
    }
  }

  function handleReset() {
    dispatch({ type: 'RESET' });
  }

  return (
    <div className="board">
      <Header />
      <Hero
        onCheck={handleCheck}
        onReset={handleReset}
        compatibleCount={state.result?.compatibleCount ?? 0}
        hasResult={Boolean(state.result)}
      />

      <ValidationBanner error={state.validationError} />

      <section className="section" id="group">
        <div className="section__head">
          <div>
            <p className="section__eyebrow">The Household</p>
            <h2>Hostel Group</h2>
            <p className="section__intro">
              Every resident&rsquo;s diet and allergens must be satisfied for a dish to count.
            </p>
          </div>
        </div>
        <BudgetControl
          budget={state.budget}
          dispatch={dispatch}
          isInvalid={state.validationError?.table === 'BUDGET'}
        />
        <GroupTable residents={state.residents} validationError={state.validationError} dispatch={dispatch} />
      </section>

      <section className="section section--alt" id="dishes">
        <div className="section__head">
          <div>
            <p className="section__eyebrow">Today&rsquo;s Menu</p>
            <h2>Cafe Dishes</h2>
            <p className="section__intro">
              Dish source order is preserved in the compatible result.
            </p>
          </div>
        </div>
        <DishTable dishes={state.dishes} validationError={state.validationError} dispatch={dispatch} />
      </section>

      <ResultsSection
        result={state.result}
        dishes={state.dishes}
        searchQuery={state.searchQuery}
        onSearchChange={(value) => dispatch({ type: 'SET_SEARCH', value })}
      />

      <footer className="site-footer">Hostel Food Compatibility Board &mdash; diet · allergen · budget</footer>
    </div>
  );
}
