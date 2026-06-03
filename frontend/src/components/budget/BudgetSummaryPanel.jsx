import { Save, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';
import { BUDGET_CATEGORIES } from '../../constants/budgetCategories.js';

export function BudgetSummaryPanel({
  totalBudget,
  allocated,
  unallocated,
  isOverBudget,
  categoryAmounts,
  onSave,
  saving,
  validating,
  disabled,
}) {
  const total = Number(totalBudget) || 0;

  return (
    <div className="card summary-panel">
      <div className="card__header">
        <h2 className="card__title">Resumo do orçamento</h2>
      </div>
      <div className="card__body">
        <div className="summary-panel__row">
          <span>Orçamento total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
        <div className="summary-panel__divider" />
        <div className="summary-panel__row">
          <span>Total alocado</span>
          <strong>{formatCurrency(allocated)}</strong>
        </div>
        <div className="summary-panel__row">
          <span className={isOverBudget ? 'text-over' : 'text-ok'}>
            {isOverBudget ? 'Ultrapassado' : 'Não alocado'}
          </span>
          <strong className={isOverBudget ? 'text-over' : 'text-ok'}>
            {formatCurrency(Math.abs(unallocated))}
          </strong>
        </div>
        <div className="summary-panel__bar" aria-hidden>
          {BUDGET_CATEGORIES.map((cat) => {
            const val = Number(categoryAmounts[cat.key]) || 0;
            const pct = total > 0 ? (val / total) * 100 : 0;
            if (pct <= 0) return null;
            return (
              <div
                key={cat.key}
                style={{ width: `${pct}%`, background: cat.color }}
                title={`${cat.label}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>
      </div>
      <div className="card__footer">
        <button
          type="button"
          className="btn btn--primary btn--block btn--lg"
          onClick={onSave}
          disabled={disabled || saving || validating || isOverBudget}
        >
          {saving || validating ? (
            <Loader2 size={20} className="spin-icon" style={{ animation: 'spin 0.8s linear infinite' }} />
          ) : (
            <Save size={20} />
          )}
          {validating ? 'Validando…' : saving ? 'Salvando…' : 'Salvar viagem'}
        </button>
      </div>
    </div>
  );
}
