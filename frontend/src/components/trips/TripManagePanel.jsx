import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import * as tripsApi from '../../api/trips.js';
import { getApiErrorMessage } from '../../utils/errors.js';
import { getMinTripStartDate, toInputDate } from '../../utils/format.js';

export function TripManagePanel({ trip, disabled, onUpdated, onDeleted }) {
  const minStartDate = getMinTripStartDate(trip.startDate);
  const [startDate, setStartDate] = useState(toInputDate(trip.startDate));
  const [endDate, setEndDate] = useState(toInputDate(trip.endDate));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!startDate || !endDate) {
      setError('Preencha as datas de início e fim.');
      return;
    }
    if (startDate > endDate) {
      setError('A data final deve ser maior ou igual à inicial.');
      return;
    }
    if (startDate < minStartDate) {
      setError('A data de início não pode ser anterior a hoje.');
      return;
    }

    setSaving(true);
    try {
      await tripsApi.updateTrip(trip.id, { startDate, endDate });
      setSuccess('Datas da viagem atualizadas.');
      await onUpdated?.();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível salvar as alterações.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Excluir a viagem para ${trip.destination}? Gastos, orçamento e itinerário serão removidos permanentemente.`
    );
    if (!confirmed) return;

    setError('');
    setSuccess('');
    setDeleting(true);
    try {
      await tripsApi.deleteTrip(trip.id);
      onDeleted?.();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível excluir a viagem.'));
      setDeleting(false);
    }
  }

  const busy = saving || deleting || disabled;

  return (
    <details className="trip-manage no-print">
      <summary>Editar ou excluir viagem</summary>
      <div className="trip-manage__body">
        <p className="trip-manage__hint">
          Ajuste o período da viagem. Orçamento e gastos permanecem; se houver lançamentos ou
          atividades fora do novo intervalo, a alteração será bloqueada.
        </p>

        <form className="trip-manage__form" onSubmit={handleSave}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="trip-edit-start">Início</label>
              <input
                id="trip-edit-start"
                type="date"
                value={startDate}
                min={minStartDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={busy}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="trip-edit-end">Fim</label>
              <input
                id="trip-edit-end"
                type="date"
                value={endDate}
                min={startDate || minStartDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={busy}
                required
              />
            </div>
          </div>

          {error ? <div className="alert alert--error">{error}</div> : null}
          {success ? <div className="alert alert--success">{success}</div> : null}

          <div className="trip-manage__actions">
            <button type="submit" className="btn btn--outline btn--sm" disabled={busy}>
              {saving ? (
                <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
              ) : null}
              Salvar datas
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm trip-manage__delete"
              onClick={handleDelete}
              disabled={busy}
            >
              {deleting ? (
                <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <Trash2 size={16} />
              )}
              Excluir viagem
            </button>
          </div>
        </form>
      </div>
    </details>
  );
}
