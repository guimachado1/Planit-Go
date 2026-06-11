import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Loader2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ExpenseForm } from '../components/expenses/ExpenseForm.jsx';
import { ExpenseList } from '../components/expenses/ExpenseList.jsx';
import { FinancialSummary } from '../components/expenses/FinancialSummary.jsx';
import { CategoryBudgetComparison } from '../components/expenses/CategoryBudgetComparison.jsx';
import { useTripFinances } from '../hooks/useTripFinances.js';
import { formatDateBR } from '../utils/format.js';
import { getProfileLabel } from '../constants/tripProfiles.js';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Wallet } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import * as tripsApi from '../api/trips.js';
import { getApiErrorMessage } from '../utils/errors.js';
import { formatCurrency, formatDateBR } from '../utils/format.js';
import { getProfileLabel } from '../constants/tripProfiles.js';
import { getCategoryLabel, BUDGET_CATEGORIES } from '../constants/budgetCategories.js';
import { getTripCoverStyle } from '../utils/tripVisuals.js';

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
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await tripsApi.getTrip(id);
        if (!cancelled) setTrip(data);
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Não foi possível carregar a viagem.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

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

  const summary = trip.budget?.summary;
  const lines = trip.budgetLines ?? trip.budget?.lines ?? [];
  const lineByCat = Object.fromEntries(lines.map((l) => [l.category, l]));

  return (
    <AppShell>
      <div className="container container--wide">
        <div className="page-header-row">
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/viagens')}>
            <ArrowLeft size={18} />
            Voltar
          </button>
          {refreshing ? (
            <span className="page-subtitle" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
              Atualizando…
            </span>
          ) : null}
        </div>

        <div className="detail-hero" style={getTripCoverStyle(trip.profile)}>
          <div className="detail-hero__content">
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
          <ExpenseForm onSubmit={addExpense} disabled={refreshing} />
          <ExpenseList expenses={expenses} loading={refreshing} />
        </div>

        <p className="page-subtitle" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
          Viagem criada em {formatDateBR(String(trip.createdAt).slice(0, 10))}
        <div className="card">
          <div className="card__header">
            <h2 className="card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet size={20} />
              Orçamento planejado
            </h2>
            <p className="card__desc">
              Distribuição salva ao criar a viagem. Gastos reais serão adicionados na próxima etapa.
            </p>
          </div>
          <div className="card__body">
            <div className="summary-panel__row">
              <span>Orçamento total</span>
              <strong>{formatCurrency(trip.totalBudget)}</strong>
            </div>
            {summary ? (
              <>
                <div className="summary-panel__divider" />
                <div className="summary-panel__row">
                  <span>Total alocado</span>
                  <strong>{formatCurrency(summary.allocatedTotal)}</strong>
                </div>
                <div className="summary-panel__row">
                  <span className="text-ok">Não alocado</span>
                  <strong className="text-ok">{formatCurrency(summary.unallocated)}</strong>
                </div>
              </>
            ) : null}
            <ul className="detail-budget-list" style={{ marginTop: '1.25rem' }}>
              {BUDGET_CATEGORIES.map((cat) => {
                const line = lineByCat[cat.key];
                if (!line) return null;
                return (
                  <li key={cat.key}>
                    <span className="cat-label">
                      <span
                        className="budget-category__dot"
                        style={{ background: cat.color }}
                      />
                      {getCategoryLabel(cat.key)}
                    </span>
                    <strong>{formatCurrency(line.plannedAmount)}</strong>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="page-subtitle" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
          Criada em {formatDateBR(String(trip.createdAt).slice(0, 10))}
        </p>
      </div>
    </AppShell>
  );
}
