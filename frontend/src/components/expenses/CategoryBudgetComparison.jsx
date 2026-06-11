import { formatCurrency } from '../../utils/format.js';
import { getCategoryLabel, BUDGET_CATEGORIES } from '../../constants/budgetCategories.js';
import { isOverBudget, percentUsed } from '../../utils/financial.js';

export function CategoryBudgetComparison({ summary }) {
  if (!summary?.byCategory?.length) return null;

  const byKey = Object.fromEntries(
    summary.byCategory.map((row) => [row.category, row])
  );

  return (
    <div className="card">
      <div className="card__header">
        <h2 className="card__title">Por categoria</h2>
        <p className="card__desc">Planejado × realizado em cada categoria.</p>
      </div>
      <div className="card__body">
        <ul className="category-compare-list">
          {BUDGET_CATEGORIES.map((cat) => {
            const row = byKey[cat.key];
            if (!row) return null;
            const planned = Number(row.planned);
            const spent = Number(row.spent);
            const remaining = Number(row.remaining);
            const pct = percentUsed(spent, planned);
            const barPct = planned > 0 ? Math.min((spent / planned) * 100, 100) : 0;
            const over = isOverBudget(spent, planned);

            return (
              <li key={cat.key} className="category-compare">
                <div className="category-compare__head">
                  <span className="cat-label">
                    <span className="budget-category__dot" style={{ background: cat.color }} />
                    {getCategoryLabel(cat.key)}
                  </span>
                  {pct != null ? (
                    <span className={`category-compare__pct ${over ? 'text-over' : ''}`}>
                      {pct}%
                    </span>
                  ) : null}
                </div>
                <div className="category-compare__values">
                  <span>Planejado: <strong>{formatCurrency(planned)}</strong></span>
                  <span>Gasto: <strong className={over ? 'text-over' : ''}>{formatCurrency(spent)}</strong></span>
                  <span className={remaining < 0 ? 'text-over' : 'text-ok'}>
                    Restante: <strong>{formatCurrency(remaining)}</strong>
                  </span>
                </div>
                <div className="progress-track progress-track--sm">
                  <div
                    className={`progress-fill ${over ? 'progress-fill--over' : ''}`}
                    style={{ width: `${barPct}%`, background: over ? undefined : cat.color }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
