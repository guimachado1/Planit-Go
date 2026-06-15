import { useEffect, useState } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import { getApiErrorMessage } from '../../utils/errors.js';
import { formatDateBR } from '../../utils/format.js';
import { TimeField } from './TimeField.jsx';

export function ItineraryItemForm({ days, defaultDayDate, onSubmit, disabled }) {
  const [dayDate, setDayDate] = useState(defaultDayDate ?? days[0]?.date ?? '');
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (days.length > 0 && !days.some((d) => d.date === dayDate)) {
      setDayDate(days[0].date);
    }
  }, [days, dayDate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!dayDate || !title.trim()) {
      setError('Preencha o dia e o título da atividade.');
      return;
    }

    if (days.length === 0) {
      setError('Não há dias disponíveis no período desta viagem.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        dayDate,
        title: title.trim(),
        startTime: startTime || undefined,
        description: description.trim() || undefined,
      });
      setTitle('');
      setStartTime('');
      setDescription('');
      setSuccess('Atividade adicionada.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível salvar a atividade.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card__header">
        <h2 className="card__title">Nova atividade</h2>
        <p className="card__desc">Organize o roteiro dia a dia da viagem.</p>
      </div>
      <div className="card__body">
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="itinerary-day">Dia</label>
            <select
              id="itinerary-day"
              value={dayDate}
              onChange={(e) => setDayDate(e.target.value)}
              required
              disabled={disabled || loading || days.length === 0}
            >
              {days.length === 0 ? (
                <option value="">Nenhum dia no período da viagem</option>
              ) : (
                days.map((day) => (
                  <option key={day.date} value={day.date}>
                    Dia {day.dayNumber} — {formatDateBR(day.date)}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="itinerary-title">Título</label>
              <input
                id="itinerary-title"
                type="text"
                maxLength={500}
                placeholder="Ex: Check-in no hotel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={disabled || loading}
              />
            </div>
            <TimeField
              id="itinerary-time"
              label="Horário (opcional)"
              value={startTime}
              onChange={setStartTime}
              disabled={disabled || loading}
            />
          </div>
          <div className="field">
            <label htmlFor="itinerary-desc">Descrição (opcional)</label>
            <input
              id="itinerary-desc"
              type="text"
              maxLength={2000}
              placeholder="Detalhes, endereço, observações…"
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
            {loading ? 'Salvando…' : 'Adicionar atividade'}
          </button>
        </form>
      </div>
    </div>
  );
}
