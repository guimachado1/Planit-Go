import { Calendar, Clock, Route } from 'lucide-react';
import { formatDateBR, formatTime } from '../../utils/format.js';

export function ReportItinerarySection({ itinerary }) {
  if (!itinerary?.days?.length) return null;

  const daysWithItems = itinerary.days.filter((day) => day.items?.length > 0);

  return (
    <section className="card report-section">
      <div className="card__header">
        <h2 className="card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Route size={20} />
          Itinerário
        </h2>
        <p className="card__desc">Atividades planejadas por dia da viagem.</p>
      </div>
      <div className="card__body">
        {daysWithItems.length === 0 ? (
          <p className="report-itinerary__empty">Nenhuma atividade cadastrada no itinerário.</p>
        ) : (
          <div className="report-itinerary">
            {daysWithItems.map((day) => (
              <div key={day.date} className="report-itinerary__day">
                <h3 className="report-itinerary__day-title">
                  <Calendar size={16} aria-hidden />
                  Dia {day.dayNumber} — {formatDateBR(day.date)}
                </h3>
                <ul className="report-itinerary__list">
                  {day.items.map((item) => (
                    <li key={item.id} className="report-itinerary__item">
                      {item.startTime ? (
                        <span className="report-itinerary__time">
                          <Clock size={14} aria-hidden />
                          {formatTime(item.startTime)}
                        </span>
                      ) : null}
                      <div>
                        <strong>{item.title}</strong>
                        {item.description ? (
                          <p className="report-itinerary__desc">{item.description}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
