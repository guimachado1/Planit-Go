import { useState } from 'react';
import { Clock, Loader2, Pencil, Trash2, X, Check } from 'lucide-react';
import { formatTime } from '../../utils/format.js';
import { getApiErrorMessage } from '../../utils/errors.js';
import { TimeField } from './TimeField.jsx';

export function ItineraryItemRow({ item, dayDate, days, onUpdate, onDelete, disabled }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [startTime, setStartTime] = useState(item.startTime ?? '');
  const [description, setDescription] = useState(item.description ?? '');
  const [selectedDay, setSelectedDay] = useState(dayDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function cancelEdit() {
    setEditing(false);
    setTitle(item.title);
    setStartTime(item.startTime ?? '');
    setDescription(item.description ?? '');
    setSelectedDay(dayDate);
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Informe um título.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onUpdate(item.id, {
        dayDate: selectedDay,
        title: title.trim(),
        startTime: startTime || null,
        description: description.trim() || null,
      });
      setEditing(false);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível atualizar.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Remover esta atividade do itinerário?')) return;
    setLoading(true);
    try {
      await onDelete(item.id);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível remover.'));
      setLoading(false);
    }
  }

  if (editing) {
    return (
      <li className="itinerary-item itinerary-item--editing">
        <form className="itinerary-item__edit-form" onSubmit={handleSave}>
          <div className="field">
            <label>Dia</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              disabled={loading}
            >
              {days.map((day) => (
                <option key={day.date} value={day.date}>
                  Dia {day.dayNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Título</label>
              <input
                type="text"
                maxLength={500}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <TimeField
              label="Horário"
              value={startTime}
              onChange={setStartTime}
              disabled={loading}
            />
          </div>
          <div className="field">
            <label>Descrição</label>
            <input
              type="text"
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          {error ? <div className="alert alert--error">{error}</div> : null}
          <div className="itinerary-item__actions">
            <button type="submit" className="btn btn--primary btn--sm" disabled={loading}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Check size={16} />}
              Salvar
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={cancelEdit} disabled={loading}>
              <X size={16} />
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="itinerary-item">
      <div className="itinerary-item__main">
        {item.startTime ? (
          <span className="itinerary-item__time">
            <Clock size={14} />
            {formatTime(item.startTime)}
          </span>
        ) : null}
        <div>
          <strong className="itinerary-item__title">{item.title}</strong>
          {item.description ? (
            <p className="itinerary-item__desc">{item.description}</p>
          ) : null}
        </div>
      </div>
      <div className="itinerary-item__actions">
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => setEditing(true)}
          disabled={disabled || loading}
          aria-label="Editar atividade"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm itinerary-item__delete"
          onClick={handleDelete}
          disabled={disabled || loading}
          aria-label="Remover atividade"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
