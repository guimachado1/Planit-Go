import { useState } from 'react';
import { Check, Loader2, Pencil, Receipt, Trash2, X } from 'lucide-react';
import { BUDGET_CATEGORIES, getCategoryLabel } from '../../constants/budgetCategories.js';
import { formatCurrency, formatDateBR, toInputDate } from '../../utils/format.js';
import { getApiErrorMessage } from '../../utils/errors.js';

function categoryColor(key) {
  return BUDGET_CATEGORIES.find((c) => c.key === key)?.color ?? '#64748b';
}

export function ExpenseRow({
  expense,
  tripStartDate,
  tripEndDate,
  disabled,
  onUpdate,
  onDelete,
}) {
  const minDate = tripStartDate ? toInputDate(tripStartDate) : undefined;
  const maxDate = tripEndDate ? toInputDate(tripEndDate) : undefined;

  const [editing, setEditing] = useState(false);
  const [category, setCategory] = useState(expense.category);
  const [amount, setAmount] = useState(String(expense.amount));
  const [spentAt, setSpentAt] = useState(toInputDate(expense.spentAt));
  const [description, setDescription] = useState(expense.description ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function cancelEdit() {
    setEditing(false);
    setCategory(expense.category);
    setAmount(String(expense.amount));
    setSpentAt(toInputDate(expense.spentAt));
    setDescription(expense.description ?? '');
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');

    if (!category || !amount || !spentAt) {
      setError('Preencha categoria, valor e data.');
      return;
    }

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Informe um valor válido maior que zero.');
      return;
    }

    if (minDate && maxDate && (spentAt < minDate || spentAt > maxDate)) {
      setError('A data do gasto deve estar dentro do período da viagem.');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(expense.id, {
        category,
        amount: value,
        spentAt,
        description: description.trim() || undefined,
      });
      setEditing(false);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível atualizar o gasto.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Remover este gasto?')) return;
    setLoading(true);
    setError('');
    try {
      await onDelete(expense.id);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível remover o gasto.'));
      setLoading(false);
    }
  }

  if (editing) {
    return (
      <li className="expense-list__item expense-list__item--editing">
        <form className="expense-list__edit-form" onSubmit={handleSave}>
          <div className="field">
            <label htmlFor={`expense-edit-cat-${expense.id}`}>Categoria</label>
            <select
              id={`expense-edit-cat-${expense.id}`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              required
            >
              {BUDGET_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor={`expense-edit-amount-${expense.id}`}>Valor (R$)</label>
              <input
                id={`expense-edit-amount-${expense.id}`}
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="field">
              <label htmlFor={`expense-edit-date-${expense.id}`}>Data</label>
              <input
                id={`expense-edit-date-${expense.id}`}
                type="date"
                value={spentAt}
                min={minDate}
                max={maxDate}
                onChange={(e) => setSpentAt(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor={`expense-edit-desc-${expense.id}`}>Descrição</label>
            <input
              id={`expense-edit-desc-${expense.id}`}
              type="text"
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          {error ? <div className="alert alert--error">{error}</div> : null}
          <div className="expense-list__actions">
            <button type="submit" className="btn btn--primary btn--sm" disabled={loading}>
              {loading ? (
                <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <Check size={16} />
              )}
              Salvar
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={cancelEdit}
              disabled={loading}
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="expense-list__item">
      <div
        className="expense-list__icon"
        style={{
          background: `${categoryColor(expense.category)}22`,
          color: categoryColor(expense.category),
        }}
      >
        <Receipt size={16} />
      </div>
      <div className="expense-list__main">
        <span className="expense-list__title">
          {expense.description || getCategoryLabel(expense.category)}
        </span>
        <span className="expense-list__meta">
          {getCategoryLabel(expense.category)} · {formatDateBR(expense.spentAt)}
        </span>
        {error ? <div className="alert alert--error">{error}</div> : null}
      </div>
      <strong className="expense-list__amount">{formatCurrency(expense.amount)}</strong>
      <div className="expense-list__actions">
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => setEditing(true)}
          disabled={disabled || loading}
          aria-label="Editar gasto"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm expense-list__delete"
          onClick={handleDelete}
          disabled={disabled || loading}
          aria-label="Remover gasto"
        >
          {loading ? (
            <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    </li>
  );
}
