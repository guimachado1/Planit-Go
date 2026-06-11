import { useState } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import { BUDGET_CATEGORIES } from '../../constants/budgetCategories.js';
import { getApiErrorMessage } from '../../utils/errors.js';

export function ExpenseForm({ onSubmit, disabled }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [spentAt, setSpentAt] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!category || !amount || !spentAt) {
      setError('Preencha categoria, valor e data.');
      return;
    }

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Informe um valor válido maior que zero.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        category,
        amount: value,
        spentAt,
        description: description.trim() || undefined,
      });
      setCategory('');
      setAmount('');
      setDescription('');
      setSuccess('Gasto registrado com sucesso.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível salvar o gasto.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card__header">
        <h2 className="card__title">Novo gasto</h2>
        <p className="card__desc">Registre despesas reais durante a viagem.</p>
      </div>
      <div className="card__body">
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="expense-category">Categoria</label>
            <select
              id="expense-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={disabled || loading}
            >
              <option value="">Selecione</option>
              {BUDGET_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="expense-amount">Valor (R$)</label>
              <input
                id="expense-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={disabled || loading}
              />
            </div>
            <div className="field">
              <label htmlFor="expense-date">Data</label>
              <input
                id="expense-date"
                type="date"
                value={spentAt}
                onChange={(e) => setSpentAt(e.target.value)}
                required
                disabled={disabled || loading}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="expense-desc">Descrição (opcional)</label>
            <input
              id="expense-desc"
              type="text"
              maxLength={2000}
              placeholder="Ex: Jantar no centro"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={disabled || loading}
            />
          </div>
          {error ? <div className="alert alert--error">{error}</div> : null}
          {success ? <div className="alert alert--success">{success}</div> : null}
          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={disabled || loading}
          >
            {loading ? (
              <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
            ) : (
              <PlusCircle size={18} />
            )}
            {loading ? 'Salvando…' : 'Registrar gasto'}
          </button>
        </form>
      </div>
    </div>
  );
}
