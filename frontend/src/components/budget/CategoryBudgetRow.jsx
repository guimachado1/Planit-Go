import { formatCurrency } from '../../utils/format.js';

export function CategoryBudgetRow({ category, amount, totalBudget, onChange }) {
  const num = Number(amount) || 0;
  const max = Number(totalBudget) || 0;

  return (
    <div className="budget-category">
      <div className="budget-category__head">
        <span className="budget-category__label">
          <span
            className="budget-category__dot"
            style={{ background: category.color }}
          />
          {category.label}
        </span>
        <span className="budget-category__amount">{formatCurrency(num)}</span>
      </div>
      <div className="budget-category__row">
        <input
          type="range"
          className="budget-category__slider"
          min={0}
          max={max}
          step={10}
          value={num}
          onChange={(e) => onChange(category.key, e.target.value)}
        />
        <div className="budget-input-wrap">
          <span>R$</span>
          <input
            type="number"
            className="budget-category__input"
            min={0}
            step={0.01}
            value={num}
            onChange={(e) => onChange(category.key, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
