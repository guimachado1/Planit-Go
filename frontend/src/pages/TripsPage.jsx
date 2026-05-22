import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export function TripsPage() {
  const { isAuthenticated, token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await client.get('/api/trips');
        if (!cancelled) setTrips(data.trips || []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.error ||
              err.message ||
              'Não foi possível carregar as viagens.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <h1 style={{ marginTop: 0 }}>Suas viagens</h1>
      <p className="muted">
        Lista mínima consumindo <code>GET /api/trips</code>. Telas e layout do Figma
        entram na próxima iteração.
      </p>
      {loading ? <p>Carregando…</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {!loading && !error && trips.length === 0 ? (
        <p>Nenhuma viagem ainda. Em seguida adicionamos o fluxo de criação.</p>
      ) : null}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {trips.map((t) => (
          <li
            key={t.id}
            className="card"
            style={{ marginBottom: '0.75rem', maxWidth: '100%' }}
          >
            <strong>{t.destination}</strong>
            <div className="muted">
              {t.startDate} → {t.endDate} · Orçamento: {t.totalBudget} · Perfil:{' '}
              {t.profile}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
