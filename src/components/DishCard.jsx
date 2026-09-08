import Badge from './Badge.jsx';

const DIET_ICON = {
  VEGAN: '🌱',
  VEGETARIAN: '🥗',
  NON_VEGETARIAN: '🍳',
};

export default function DishCard({ dish }) {
  return (
    <article className="dish-card">
      <div className="dish-card__top">
        <span className="dish-card__icon" aria-hidden="true">
          {DIET_ICON[dish.dietClass] || '🍽️'}
        </span>
        <Badge tone="ok">Compatible</Badge>
      </div>
      <div>
        <h3 className="dish-card__name">{dish.name}</h3>
        <p className="dish-card__meta">
          {dish.cafe} &middot; ₹{dish.price} &middot; {dish.dietClass.replace('_', ' ')}
        </p>
      </div>
      <div className="dish-card__chips">
        <span className="chip">Diet ✓</span>
        <span className="chip">Allergens ✓</span>
        <span className="chip">Budget ✓</span>
      </div>
    </article>
  );
}
