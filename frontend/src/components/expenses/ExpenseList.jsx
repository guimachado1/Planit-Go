import { Receipt } from 'lucide-react';
import { getCategoryLabel, BUDGET_CATEGORIES } from '../../constants/budgetCategories.js';
import { formatCurrency, formatDateBR } from '../../utils/format.js';

function categoryColor(key) {
  return BUDGET_CATEGORIES.find((c) => c.key === key)?.color ?? '#64748b';
}

export function ExpenseList({ expenses, loading }) {
  if (loading && expenses.length === 0) {
    return (
      <div className="card">
        <div className="card__body">
          <p className="page-subtitle" style={{ margin: 0 }}>Carregando gastos…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <h2 className="card__title">Histórico de gastos</h2>
        <p className="card__desc">
          {expenses.length === 0
            ? 'Nenhum gasto registrado ainda.'
            : `${expenses.length} lançamento(s)`}
        </p>
      </div>
      <div className="card__body" style={{ paddingTop: 0 }}>
        {expenses.length === 0 ? (
          <div className="expense-empty">
            <Receipt size={40} strokeWidth={1.25} />
            <p>Registre o primeiro gasto usando o formulário acima.</p>
          </div>
        ) : (
          <ul className="expense-list">
            {expenses.map((exp) => (
              <li key={exp.id} className="expense-list__item">
                <div className="expense-list__icon" style={{ background: `${categoryColor(exp.category)}22`, color: categoryColor(exp.category) }}>
                  <Receipt size={16} />
                </div>
                <div className="expense-list__main">
                  <span className="expense-list__title">
                    {exp.description || getCategoryLabel(exp.category)}
                  </span>
                  <span className="expense-list__meta">
                    {getCategoryLabel(exp.category)} · {formatDateBR(exp.spentAt)}
                  </span>
                </div>
                <strong className="expense-list__amount">
                  {formatCurrency(exp.amount)}
                </strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
