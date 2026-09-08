export default function ValidationBanner({ error }) {
  if (!error) return null;

  const tableLabel = { GROUP: 'Group table', DISH: 'Dish table', BUDGET: 'Budget' }[error.table] || error.table;

  return (
    <div className="validation-banner">
      <div className="validation-banner__box" role="alert">
        <span className="validation-banner__code">{error.code}</span>
        <span>
          {tableLabel}
          {error.row ? ` — row "${error.row}"` : ''}
          {error.field ? ` — field "${error.field}"` : ''}
        </span>
      </div>
    </div>
  );
}
