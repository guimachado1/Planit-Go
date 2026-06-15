import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, MapPin } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { FinancialSummary } from '../components/expenses/FinancialSummary.jsx';
import { CategoryBudgetComparison } from '../components/expenses/CategoryBudgetComparison.jsx';
import { ReportCategoryInsights } from '../components/report/ReportCategoryInsights.jsx';
import { ReportItinerarySection } from '../components/report/ReportItinerarySection.jsx';
import { TRIP_STATUS } from '../constants/tripStatus.js';
import { useTripReport } from '../hooks/useTripReport.js';
import { formatDateBR, formatCurrency } from '../utils/format.js';
import { percentUsed } from '../utils/financial.js';
import { getProfileLabel } from '../constants/tripProfiles.js';
import { resolveTripDisplayStatus } from '../utils/tripVisuals.js';

function todayIsoDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function TripReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trip, summary, itinerary, loading, error } = useTripReport(id);

  if (loading) {
    return (
      <AppShell>
        <div className="spinner-wrap">
          <div className="spinner" />
          <p>Carregando relatório…</p>
        </div>
      </AppShell>
    );
  }

  if (error || !trip || !summary) {
    return (
      <AppShell>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="alert alert--error">{error || 'Relatório indisponível.'}</div>
          <Link to="/viagens" className="btn btn--primary" style={{ marginTop: '1rem' }}>
            Voltar às viagens
          </Link>
        </div>
      </AppShell>
    );
  }

  const tripStatus = resolveTripDisplayStatus(trip);
  const isFinal = tripStatus.status === TRIP_STATUS.COMPLETED;
  const totalPct = percentUsed(summary.totalSpent, summary.totalBudget);

  return (
    <AppShell>
      <div className="trip-report container container--wide">
        <div className="no-print page-header-row">
          <button type="button" className="btn btn--ghost" onClick={() => navigate(`/viagens/${id}`)}>
            <ArrowLeft size={18} />
            Finanças
          </button>
          <Link to={`/viagens/${id}`} className="btn btn--outline btn--sm">
            Voltar à viagem
          </Link>
        </div>

        <header className="report-header">
          <div className="report-header__brand">
            <FileText size={28} aria-hidden />
            <div>
              <p className="report-header__app">Planit Go</p>
              <h1>{isFinal ? 'Relatório final da viagem' : 'Relatório parcial da viagem'}</h1>
            </div>
          </div>

          <div
            className={`report-banner ${isFinal ? 'report-banner--final' : 'report-banner--preview'}`}
          >
            <span className={`badge badge--${tripStatus.variant}`}>{tripStatus.label}</span>
            <p>
              {isFinal
                ? 'Comparação entre o orçamento planejado e os gastos registrados após o término da viagem.'
                : 'Prévia com os valores registrados até o momento. O relatório final será consolidado quando a viagem estiver finalizada.'}
            </p>
          </div>

          <div className="report-header__trip">
            <h2>{trip.destination}</h2>
            <div className="report-header__meta">
              <span>
                <MapPin size={14} aria-hidden />
                {getProfileLabel(trip.profile)}
              </span>
              <span>
                <Calendar size={14} aria-hidden />
                {formatDateBR(trip.startDate)} – {formatDateBR(trip.endDate)}
              </span>
            </div>
          </div>
        </header>

        <div className={`report-highlight ${isFinal ? 'report-highlight--final' : ''}`}>
          <FinancialSummary summary={summary} />
          {isFinal ? (
            <div className="card report-final-stats">
              <div className="card__header">
                <h2 className="card__title">Análise final</h2>
                <p className="card__desc">
                  Resumo consolidado planejado × realizado por categoria.
                </p>
              </div>
              <div className="card__body">
                <div className="report-final-stats__grid">
                  <div>
                    <span>Total planejado</span>
                    <strong>{summary.totalBudget != null ? formatCurrency(summary.totalBudget) : '—'}</strong>
                  </div>
                  <div>
                    <span>Total gasto</span>
                    <strong>{formatCurrency(summary.totalSpent)}</strong>
                  </div>
                  <div>
                    <span>Saldo final</span>
                    <strong
                      className={
                        Number(summary.totalRemaining) < 0 ? 'text-over' : 'text-ok'
                      }
                    >
                      {formatCurrency(summary.totalRemaining)}
                    </strong>
                  </div>
                  <div>
                    <span>Orçamento utilizado</span>
                    <strong>{totalPct != null ? `${totalPct}%` : '—'}</strong>
                  </div>
                </div>
                <ReportCategoryInsights summary={summary} isFinal />
              </div>
            </div>
          ) : (
            <div className="card report-preview-note">
              <div className="card__body">
                <p>
                  Utilização atual do orçamento:{' '}
                  <strong>{totalPct != null ? `${totalPct}%` : '—'}</strong>
                  {Number(summary.totalRemaining) >= 0 ? (
                    <>
                      {' '}
                      · Saldo restante{' '}
                      <strong className="text-ok">
                        {formatCurrency(summary.totalRemaining)}
                      </strong>
                    </>
                  ) : (
                    <>
                      {' '}
                      · Acima do planejado em{' '}
                      <strong className="text-over">
                        {formatCurrency(Math.abs(summary.totalRemaining))}
                      </strong>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="report-sections">
          <CategoryBudgetComparison summary={summary} />
          <ReportItinerarySection itinerary={itinerary} />
        </div>

        <footer className="report-footer">
          <p>
            Relatório gerado em {formatDateBR(todayIsoDate())} · Planit Go
          </p>
        </footer>
      </div>
    </AppShell>
  );
}
