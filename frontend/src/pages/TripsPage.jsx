import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Plus } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { TripCard } from '../components/trips/TripCard.jsx';
import * as tripsApi from '../api/trips.js';
import { getApiErrorMessage } from '../utils/errors.js';

export function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const list = await tripsApi.listTrips();
        if (!cancelled) setTrips(list);
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Não foi possível carregar as viagens.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <div className="container container--wide">
        <h1 className="page-title">Suas viagens</h1>
        <p className="page-subtitle">
          Planeje, distribua o orçamento por categoria e acompanhe cada destino.
        </p>

        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
            <p>Carregando…</p>
          </div>
        ) : null}

        {error ? <div className="alert alert--error">{error}</div> : null}

        {!loading && !error && trips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon-wrap">
              <Plane size={40} />
            </div>
            <h2>Nenhuma viagem planejada</h2>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
              O mundo é enorme. Comece criando sua primeira aventura!
            </p>
            <Link to="/viagens/nova" className="btn btn--primary btn--lg">
              <Plus size={18} />
              Criar primeira viagem
            </Link>
          </div>
        ) : null}

        {!loading && trips.length > 0 ? (
          <div className="trip-grid">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
