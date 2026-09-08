import Badge from './Badge.jsx';

export default function ExclusionRow({ dish, reasons }) {
  const onlyOverBudget = reasons.length === 1 && reasons[0] === 'OVER_BUDGET';

  return (
    <div className="exclusion-row">
      <span className="exclusion-row__id">{dish.id}</span>
      <span className="exclusion-row__name">{dish.name}</span>
      <Badge tone={onlyOverBudget ? 'warn' : 'bad'}>
        {onlyOverBudget ? 'Over budget' : 'Excluded'}
      </Badge>
      <div className="exclusion-row__reasons">
        {reasons.map((reason) => (
          <span className="chip chip--bad" key={reason}>
            {reason}
          </span>
        ))}
      </div>
    </div>
  );
}
