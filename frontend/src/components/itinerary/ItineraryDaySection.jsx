import { CalendarDays } from 'lucide-react';
import { formatDateBR } from '../../utils/format.js';
import { ItineraryItemRow } from './ItineraryItemRow.jsx';

export function ItineraryDaySection({ day, days, onUpdate, onDelete, disabled }) {
  return (
    <section className="itinerary-day">
      <header className="itinerary-day__header">
        <span className="itinerary-day__badge">Dia {day.dayNumber}</span>
        <h3 className="itinerary-day__date">
          <CalendarDays size={18} />
          {formatDateBR(day.date)}
        </h3>
        <span className="itinerary-day__count">
          {day.items.length === 0
            ? 'Sem atividades'
            : `${day.items.length} atividade(s)`}
        </span>
      </header>
      {day.items.length === 0 ? (
        <p className="itinerary-day__empty">Nenhuma atividade neste dia.</p>
      ) : (
        <ul className="itinerary-day__list">
          {day.items.map((item) => (
            <ItineraryItemRow
              key={item.id}
              item={item}
              dayDate={day.date}
              days={days}
              onUpdate={onUpdate}
              onDelete={onDelete}
              disabled={disabled}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
