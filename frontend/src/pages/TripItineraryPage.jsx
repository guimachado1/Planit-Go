import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2, MapPin, Wallet } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ItineraryItemForm } from '../components/itinerary/ItineraryItemForm.jsx';
import { ItineraryDaySection } from '../components/itinerary/ItineraryDaySection.jsx';
import { useTripItinerary } from '../hooks/useTripItinerary.js';
import { formatDateBR } from '../utils/format.js';
import { getProfileLabel } from '../constants/tripProfiles.js';
import { getTripCoverStyle } from '../utils/tripVisuals.js';

export function TripItineraryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    trip,
    itinerary,
    loading,
    refreshing,
    error,
    addItem,
    updateItem,
    removeItem,
  } = useTripItinerary(id);

  if (loading) {
    return (
      <AppShell>
        <div className="spinner-wrap">
          <div className="spinner" />
          <p>Carregando itinerário…</p>
        </div>
      </AppShell>
    );
  }

  if (error || !trip || !itinerary) {
    return (
      <AppShell>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="alert alert--error">{error || 'Viagem não encontrada.'}</div>
          <Link to="/viagens" className="btn btn--primary" style={{ marginTop: '1rem' }}>
            Voltar às viagens
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container container--wide">
        <div className="page-header-row">
          <button type="button" className="btn btn--ghost" onClick={() => navigate(`/viagens/${id}`)}>
            <ArrowLeft size={18} />
            Finanças
          </button>
          <div className="page-header-row__actions">
            <Link to={`/viagens/${id}`} className="btn btn--outline btn--sm">
              <Wallet size={16} />
              Orçamento e gastos
            </Link>
            {refreshing ? (
              <span
                className="page-subtitle"
                style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
                Atualizando…
              </span>
            ) : null}
          </div>
        </div>

        <div className="detail-hero" style={getTripCoverStyle(trip.profile)}>
          <div className="detail-hero__content">
            <h2>{trip.destination}</h2>
            <p className="detail-hero__subtitle">Itinerário diário</p>
            <div className="detail-hero__chips">
              <span className="detail-chip">
                <MapPin size={14} />
                {getProfileLabel(trip.profile)}
              </span>
              <span className="detail-chip">
                <Calendar size={14} />
                {formatDateBR(trip.startDate)} – {formatDateBR(trip.endDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="itinerary-layout">
          <ItineraryItemForm
            days={itinerary.days}
            onSubmit={addItem}
            disabled={refreshing}
          />
          <div className="itinerary-timeline">
            {itinerary.days.map((day) => (
              <ItineraryDaySection
                key={day.date}
                day={day}
                days={itinerary.days}
                onUpdate={updateItem}
                onDelete={removeItem}
                disabled={refreshing}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
