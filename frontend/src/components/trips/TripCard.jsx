import { Link } from 'react-router-dom';
import { Calendar, MapPin, Wallet } from 'lucide-react';
import { formatCurrency, formatDateBR } from '../../utils/format.js';
import { getProfileLabel } from '../../constants/tripProfiles.js';
import { getTripCoverStyle, resolveTripDisplayStatus } from '../../utils/tripVisuals.js';

export function TripCard({ trip }) {
  const status = resolveTripDisplayStatus(trip);
  const coverStyle = getTripCoverStyle(trip.profile);

  return (
    <Link to={`/viagens/${trip.id}`} className="trip-card">
      <div className="trip-card__cover" style={coverStyle}>
        <span className={`badge badge--${status.variant}`}>{status.label}</span>
      </div>
      <div className="trip-card__body">
        <h3>{trip.destination}</h3>
        <p className="trip-card__meta">
          <MapPin size={14} />
          {getProfileLabel(trip.profile)}
        </p>
        <p className="trip-card__meta">
          <Calendar size={14} />
          {formatDateBR(trip.startDate)} – {formatDateBR(trip.endDate)}
        </p>
        <p className="trip-card__budget">
          <Wallet size={14} />
          {formatCurrency(trip.totalBudget)}
        </p>
      </div>
    </Link>
  );
}
