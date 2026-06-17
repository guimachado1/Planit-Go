import { Receipt } from 'lucide-react';
import { ExpenseRow } from './ExpenseRow.jsx';

export function ExpenseList({
  expenses,
  loading,
  disabled,
  tripStartDate,
  tripEndDate,
  onUpdate,
  onDelete,
}) {
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
            <p>Registre o primeiro gasto usando o formulário ao lado.</p>
          </div>
        ) : (
          <ul className="expense-list">
            {expenses.map((exp) => (
              <ExpenseRow
                key={exp.id}
                expense={exp}
                tripStartDate={tripStartDate}
                tripEndDate={tripEndDate}
                disabled={disabled || loading}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
