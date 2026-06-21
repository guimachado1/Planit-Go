import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaneTakeoff, Loader2, MapPin } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { TRIP_PROFILES } from '../constants/tripProfiles.js';
import * as tripsApi from '../api/trips.js';
import { getApiErrorMessage } from '../utils/errors.js';
import { getTodayInputDate } from '../utils/format.js';

export function CreateTripPage() {
  const navigate = useNavigate();
  const today = getTodayInputDate();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!destination || !startDate || !endDate || !totalBudget || !profile) {
      setError('Preencha todos os campos para continuar.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('A data final deve ser maior ou igual à data inicial.');
      return;
    }

    if (startDate < today) {
      setError('A data de ida não pode ser anterior a hoje.');
      return;
    }

    const budget = Number(totalBudget);
    if (!Number.isFinite(budget) || budget <= 0) {
      setError('Informe um orçamento total válido.');
      return;
    }

    setLoading(true);
    try {
      const tripForm = {
        destination: destination.trim(),
        startDate,
        endDate,
        totalBudget: budget,
        profile,
      };

      const suggestion = await tripsApi.suggestBudget({
        profile,
        totalBudget: budget,
      });

      navigate('/viagens/nova/orcamento', {
        state: { tripForm, suggestion },
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao obter sugestão de orçamento.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="container container--narrow">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">
              <PlaneTakeoff size={28} />
              Nova viagem
            </h1>
            <span className="step-badge">Passo 1 de 2</span>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              Destino, datas, orçamento e perfil da viagem.
            </p>
          </div>
          <button type="button" className="btn btn--outline" onClick={() => navigate('/viagens')}>
            Voltar
          </button>
        </div>

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Detalhes do destino</h2>
            <p className="card__desc">
              O perfil define a distribuição automática sugerida na próxima etapa.
            </p>
          </div>
          <div className="card__body">
            <form id="create-trip-form" className="form-stack" onSubmit={handleSubmit}>
              <div className="field field--icon">
                <label htmlFor="destination">Destino</label>
                <div className="field__icon-wrap">
                  <MapPin className="field__icon" size={16} />
                  <input
                    id="destination"
                    placeholder="Ex: Florianópolis"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="startDate">Data de ida</label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="endDate">Data de volta</label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    min={startDate || today}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="totalBudget">Orçamento total (R$)</label>
                  <input
                    id="totalBudget"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="5000"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="profile">Perfil da viagem</label>
                  <select
                    id="profile"
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    required
                  >
                    <option value="">Selecione o perfil</option>
                    {TRIP_PROFILES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error ? <div className="alert alert--error">{error}</div> : null}
            </form>
          </div>
          <div className="card__footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              form="create-trip-form"
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
              ) : null}
              {loading ? 'Gerando orçamento…' : 'Continuar para orçamento'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
