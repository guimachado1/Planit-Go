import { TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';
import { percentUsed } from '../../utils/financial.js';

export function FinancialSummary({ summary }) {
  if (!summary) return null;

  const totalBudget = Number(summary.totalBudget);
  const totalSpent = Number(summary.totalSpent);
  const totalRemaining = Number(summary.totalRemaining);
  const pct = percentUsed(totalSpent, totalBudget);
  const barPct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const overTotal = totalSpent > totalBudget;

  return (
    <div className="card">
      <div className="card__header">
        <h2 className="card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wallet size={20} />
          Resumo financeiro
        </h2>
        <p className="card__desc">Planejado da viagem × gastos reais registrados.</p>
      </div>
      <div className="card__body">
        <div className="finance-totals">
          <div className="finance-totals__item">
            <span>Orçamento total</span>
            <strong>{formatCurrency(totalBudget)}</strong>
          </div>
          <div className="finance-totals__item">
            <span>Total gasto</span>
            <strong className={overTotal ? 'text-over' : ''}>
              {formatCurrency(totalSpent)}
            </strong>
          </div>
          <div className="finance-totals__item">
            <span>Saldo restante</span>
            <strong className={totalRemaining < 0 ? 'text-over' : 'text-ok'}>
              {formatCurrency(totalRemaining)}
            </strong>
          </div>
        </div>

        <div className="progress-block">
          <div className="progress-block__head">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <TrendingUp size={16} />
              Utilização do orçamento
            </span>
            <span className={overTotal ? 'text-over' : ''}>
              {pct != null ? `${pct}%` : '—'}
              {overTotal ? ' · acima do limite' : ''}
            </span>
          </div>
          <div className="progress-track">
            <div
              className={`progress-fill ${overTotal ? 'progress-fill--over' : ''}`}
              style={{ width: `${barPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
