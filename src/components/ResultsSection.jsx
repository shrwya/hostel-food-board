import DishCard from './DishCard.jsx';
import ExclusionRow from './ExclusionRow.jsx';
import SearchBox from './SearchBox.jsx';
import { filterCompatibleDishes } from '../logic/search.js';

export default function ResultsSection({ result, dishes, searchQuery, onSearchChange }) {
  const hasResult = Boolean(result);
  const compatible = hasResult ? result.compatible : [];
  const visibleCompatible = filterCompatibleDishes(compatible, searchQuery);
  const excludedDishes = hasResult
    ? dishes.filter((dish) => Object.prototype.hasOwnProperty.call(result.exclusions, dish.id))
    : [];

  return (
    <section className="section" id="results">
      <div className="section__head">
        <div>
          <p className="section__eyebrow">Compatibility Result</p>
          <h2>Who Can Eat What</h2>
          <p className="section__intro">
            Run the check above to see which dishes clear every resident&rsquo;s diet, allergen,
            and budget rule at once.
          </p>
        </div>
      </div>

      {!hasResult && (
        <p className="empty-note">
          No result yet. Click &ldquo;Check Compatibility&rdquo; to evaluate the current group,
          dishes, and budget.
        </p>
      )}

      {hasResult && (
        <>
          <div className="results-toolbar">
            <div className="compat-count">
              <strong>{result.compatibleCount}</strong>
              <span>Compatible dish{result.compatibleCount === 1 ? '' : 'es'}</span>
            </div>
            <SearchBox value={searchQuery} onChange={onSearchChange} disabled={compatible.length === 0} />
          </div>

          {visibleCompatible.length > 0 ? (
            <div className="card-grid" style={{ marginBottom: 'var(--space-6)' }}>
              {visibleCompatible.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          ) : (
            <p className="empty-note" style={{ marginBottom: 'var(--space-6)' }}>
              {compatible.length === 0
                ? 'No dish satisfies every diet, allergen, and budget rule for this group.'
                : 'No compatible dish matches that search.'}
            </p>
          )}

          {excludedDishes.length > 0 && (
            <>
              <p className="section__eyebrow" style={{ marginTop: 'var(--space-6)' }}>
                Excluded Dishes
              </p>
              <div className="exclusion-list">
                {excludedDishes.map((dish) => (
                  <ExclusionRow key={dish.id} dish={dish} reasons={result.exclusions[dish.id]} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
