export default function Hero({ onCheck, onReset, compatibleCount, hasResult }) {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div>
          <p className="eyebrow">Compatibility Check</p>
          <p className="hero__question">
            Which single dish can Asha, Dev, and Mira all actually eat?
          </p>
          <h1>
            Find The Dish
            <br />
            Everyone Can Eat
          </h1>
          <p className="lede">
            Enter your hostel group&rsquo;s diets, allergens, and one shared budget, then
            check the day&rsquo;s cafe dishes against every rule at once &mdash; diet class,
            allergen exclusions, and price per serving.
          </p>
        </div>

        <div className="hero__panel">
          <div className="hero__count">
            <span className="hero__count-num">{hasResult ? compatibleCount : '—'}</span>
            <span className="hero__count-label">Compatible dishes</span>
          </div>
          <div className="hero__actions">
            <button type="button" className="btn btn-primary" onClick={onCheck}>
              Check Compatibility
            </button>
            <button type="button" className="btn btn-ghost" onClick={onReset}>
              Reset to Sample
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
