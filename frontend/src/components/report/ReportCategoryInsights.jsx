import { CircleAlert, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';
import { buildCategoryBudgetInsights } from '../../utils/reportInsights.js';

export function ReportCategoryInsights({ summary, isFinal }) {
  if (!summary?.byCategory?.length) return null;

  const { overBudget, underBudget } = buildCategoryBudgetInsights(summary.byCategory);
  const hasInsights = overBudget.length > 0 || underBudget.length > 0;

  if (!hasInsights) {
    return (
      <div className="report-insights report-insights--empty">
        <p>
          {isFinal
            ? 'Todas as categorias com orçamento definido ficaram dentro do planejado ou no limite exato.'
            : 'Nenhuma categoria acima ou abaixo do planejado até o momento.'}
        </p>
      </div>
    );
  }

  return (
    <div className="report-insights">
      {overBudget.length > 0 ? (
        <div className="report-insights__group report-insights__group--over">
          <h3>
            <CircleAlert size={18} aria-hidden />
            Acima do orçamento
          </h3>
          <ul>
            {overBudget.map((row) => (
              <li key={row.category}>
                <span className="report-insights__label">{row.label}</span>
                <span className="report-insights__detail">
                  Gasto {formatCurrency(row.spent)} de {formatCurrency(row.planned)}
                  {' · '}
                  <strong className="text-over">+{formatCurrency(row.difference)}</strong>
                  {row.percentUsed != null ? ` (${row.percentUsed}%)` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {underBudget.length > 0 ? (
        <div className="report-insights__group report-insights__group--under">
          <h3>
            <TrendingDown size={18} aria-hidden />
            Abaixo do orçamento
          </h3>
          <ul>
            {underBudget.map((row) => (
              <li key={row.category}>
                <span className="report-insights__label">{row.label}</span>
                <span className="report-insights__detail">
                  Gasto {formatCurrency(row.spent)} de {formatCurrency(row.planned)}
                  {' · '}
                  <strong className="text-ok">−{formatCurrency(row.difference)}</strong>
                  {row.percentUsed != null ? ` (${row.percentUsed}%)` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
