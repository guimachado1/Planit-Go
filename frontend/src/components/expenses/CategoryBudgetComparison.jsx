import { AlertTriangle, CircleAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';
import { getCategoryLabel, BUDGET_CATEGORIES } from '../../constants/budgetCategories.js';
import {
  budgetAlertForAmounts,
  getActiveBudgetAlerts,
  percentUsed,
} from '../../utils/financial.js';

function resolveAlert(row) {
  if (row.alertLevel) {
    return {
      percentUsed: row.percentUsed,
      alertLevel: row.alertLevel,
      alertLabel: row.alertLabel,
    };
  }
  return budgetAlertForAmounts(row.spent, row.planned);
}

export function CategoryBudgetComparison({ summary }) {
  if (!summary?.byCategory?.length) return null;

  const byKey = Object.fromEntries(
    summary.byCategory.map((row) => [row.category, row])
  );

  const activeAlerts = getActiveBudgetAlerts(summary);
  const alertHint =
    activeAlerts.length === 0
      ? null
      : activeAlerts.length === 1
        ? '1 categoria precisa de atenção'
        : `${activeAlerts.length} categorias precisam de atenção`;

  return (
    <div className="card">
      <div className="card__header">
        <div className="category-compare-header">
          <div>
            <h2 className="card__title">Por categoria</h2>
            <p className="card__desc">
              Atenção a partir de 80% · ultrapassado acima de 100%.
            </p>
          </div>
          {alertHint ? (
            <span className="category-compare-summary-pill">{alertHint}</span>
          ) : null}
        </div>
      </div>
      <div className="card__body">
        <ul className="category-compare-list">
          {BUDGET_CATEGORIES.map((cat) => {
            const row = byKey[cat.key];
            if (!row) return null;

            const planned = Number(row.planned);
            const spent = Number(row.spent);
            const remaining = Number(row.remaining);
            const alert = resolveAlert(row);
            const pct = alert.percentUsed ?? percentUsed(spent, planned);
            const level = alert.alertLevel;
            const barPct =
              planned > 0 ? Math.min((spent / planned) * 100, 100) : 0;

            return (
              <li
                key={cat.key}
                className={`category-compare category-compare--${level}`}
              >
                <div className="category-compare__head">
                  <span className="cat-label">
                    <span
                      className="budget-category__dot"
                      style={{ background: cat.color }}
                    />
                    {getCategoryLabel(cat.key)}
                  </span>
                  <span className="category-compare__status">
                    {level === 'warning' ? (
                      <AlertTriangle size={14} aria-hidden />
                    ) : null}
                    {level === 'over' ? <CircleAlert size={14} aria-hidden /> : null}
                    {level !== 'ok' ? (
                      <span className={`budget-status-badge budget-status-badge--${level}`}>
                        {alert.alertLabel}
                      </span>
                    ) : null}
                    {pct != null ? (
                      <span
                        className={`category-compare__pct category-compare__pct--${level}`}
                      >
                        {pct}%
                      </span>
                    ) : null}
                  </span>
                </div>

                <div className="category-compare__values">
                  <span>
                    Planejado <strong>{formatCurrency(planned)}</strong>
                  </span>
                  <span>
                    Gasto{' '}
                    <strong className={level === 'over' ? 'text-over' : ''}>
                      {formatCurrency(spent)}
                    </strong>
                  </span>
                  <span className={remaining < 0 ? 'text-over' : 'text-ok'}>
                    Restante <strong>{formatCurrency(remaining)}</strong>
                  </span>
                </div>

                <div className="progress-track progress-track--sm">
                  <div
                    className={`progress-fill progress-fill--${level}`}
                    style={{
                      width: `${barPct}%`,
                      background:
                        level === 'ok' ? cat.color : undefined,
                    }}
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
