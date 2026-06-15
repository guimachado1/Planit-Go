import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Loader2, Route, FileText } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ExpenseForm } from '../components/expenses/ExpenseForm.jsx';
import { ExpenseList } from '../components/expenses/ExpenseList.jsx';
import { FinancialSummary } from '../components/expenses/FinancialSummary.jsx';
import { CategoryBudgetComparison } from '../components/expenses/CategoryBudgetComparison.jsx';
import { useTripFinances } from '../hooks/useTripFinances.js';
import { formatDateBR } from '../utils/format.js';
import { getProfileLabel } from '../constants/tripProfiles.js';
import { getTripCoverStyle, resolveTripDisplayStatus } from '../utils/tripVisuals.js';
import { TRIP_STATUS } from '../constants/tripStatus.js';

export function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    trip,
    summary,
    expenses,
    loading,
    refreshing,
    error,
    addExpense,
  } = useTripFinances(id);

  if (loading) {
    return (
      <AppShell>
        <div className="spinner-wrap">
          <div className="spinner" />
          <p>Carregando viagem…</p>
        </div>
      </AppShell>
    );
  }

  if (error || !trip) {
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

  const coverStyle = getTripCoverStyle(trip.profile);
  const tripStatus = resolveTripDisplayStatus(trip);
  const isFinal = tripStatus.status === TRIP_STATUS.COMPLETED;

  return (
    <AppShell>
      <div className="container container--wide">
        <div className="page-header-row">
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/viagens')}>
            <ArrowLeft size={18} />
            Voltar
          </button>
          <div className="page-header-row__actions">
            <Link
              to={`/viagens/${id}/relatorio`}
              className={`btn btn--sm ${isFinal ? 'btn--primary' : 'btn--outline'}`}
            >
              <FileText size={16} />
              {isFinal ? 'Relatório final' : 'Relatório'}
            </Link>
            <Link to={`/viagens/${id}/itinerario`} className="btn btn--outline btn--sm">
              <Route size={16} />
              Itinerário
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

        <div className="detail-hero" style={coverStyle}>
          <div className="detail-hero__content">
            <span className={`badge badge--${tripStatus.variant} detail-hero__status`}>
              {tripStatus.label}
            </span>
            <h2>{trip.destination}</h2>
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

        <FinancialSummary summary={summary} />
        <div style={{ marginTop: '1.25rem' }}>
          <CategoryBudgetComparison summary={summary} />
        </div>

        <div className="detail-expenses-grid">
          <ExpenseForm
            onSubmit={addExpense}
            disabled={refreshing}
            tripStartDate={trip.startDate}
            tripEndDate={trip.endDate}
          />
          <ExpenseList expenses={expenses} loading={refreshing} />
        </div>

        <p className="page-subtitle" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
          Viagem criada em {formatDateBR(String(trip.createdAt).slice(0, 10))}
        </p>
      </div>
    </AppShell>
  );
}
