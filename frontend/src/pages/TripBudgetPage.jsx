import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, PieChart } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { CategoryBudgetRow } from '../components/budget/CategoryBudgetRow.jsx';
import { BudgetSummaryPanel } from '../components/budget/BudgetSummaryPanel.jsx';
import { BUDGET_CATEGORIES } from '../constants/budgetCategories.js';
import { getProfileLabel } from '../constants/tripProfiles.js';
import * as tripsApi from '../api/trips.js';
import {
  amountsFromSuggestion,
  toCategoryAmounts,
  useTripBudgetTotals,
} from '../hooks/useTripBudgetForm.js';
import { formatDateRange } from '../utils/format.js';
import { getApiErrorMessage } from '../utils/errors.js';

export function TripBudgetPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripForm, suggestion } = location.state ?? {};

  const [categoryAmounts, setCategoryAmounts] = useState(() =>
    amountsFromSuggestion(suggestion?.suggested)
  );
  const [previewError, setPreviewError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);

  const totals = useTripBudgetTotals(categoryAmounts, tripForm?.totalBudget);

  useEffect(() => {
    if (!tripForm || !suggestion) {
      navigate('/viagens/nova', { replace: true });
    }
  }, [tripForm, suggestion, navigate]);

  if (!tripForm || !suggestion) {
    return null;
  }

  function handleCategoryChange(key, value) {
    const num = value === '' ? 0 : Number(value);
    setCategoryAmounts((prev) => ({ ...prev, [key]: num }));
    setPreviewError('');
  }

  async function handleSave() {
    if (totals.isOverBudget) {
      setPreviewError('A soma das categorias não pode ultrapassar o orçamento total.');
      return;
    }

    setPreviewError('');
    setSaveError('');
    setValidating(true);

    const categoryPayload = toCategoryAmounts(categoryAmounts);

    try {
      await tripsApi.previewBudget({
        profile: tripForm.profile,
        totalBudget: tripForm.totalBudget,
        categoryAmounts: categoryPayload,
      });
    } catch (err) {
      setPreviewError(getApiErrorMessage(err, 'Ajuste manual inválido.'));
      setValidating(false);
      return;
    }

    setValidating(false);
    setSaving(true);

    try {
      const trip = await tripsApi.createTrip({
        ...tripForm,
        categoryAmounts: categoryPayload,
      });
      navigate(`/viagens/${trip.id}`, { replace: true });
    } catch (err) {
      setSaveError(getApiErrorMessage(err, 'Erro ao salvar a viagem.'));
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="container container--wide">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">
              <PieChart size={28} />
              Distribuição do orçamento
            </h1>
            <span className="step-badge">Passo 2 de 2</span>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              {tripForm.destination} · {formatDateRange(tripForm.startDate, tripForm.endDate)} ·{' '}
              {getProfileLabel(tripForm.profile)}
            </p>
          </div>
          <button type="button" className="btn btn--outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>

        <div className="budget-grid">
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Ajuste manual</h2>
              <p className="card__desc">
                Valores sugeridos pelo backend. Ajuste antes de salvar; a validação final é feita na API.
              </p>
            </div>
            <div className="card__body">
              {BUDGET_CATEGORIES.map((cat) => (
                <CategoryBudgetRow
                  key={cat.key}
                  category={cat}
                  amount={categoryAmounts[cat.key]}
                  totalBudget={tripForm.totalBudget}
                  onChange={handleCategoryChange}
                />
              ))}
            </div>
          </div>

          <div>
            <BudgetSummaryPanel
              totalBudget={tripForm.totalBudget}
              allocated={totals.allocated}
              unallocated={totals.unallocated}
              isOverBudget={totals.isOverBudget}
              categoryAmounts={categoryAmounts}
              onSave={handleSave}
              saving={saving}
              validating={validating}
              disabled={false}
            />
            {previewError ? (
              <div className="alert alert--error" style={{ marginTop: '1rem' }}>
                {previewError}
              </div>
            ) : null}
            {saveError ? (
              <div className="alert alert--error" style={{ marginTop: '1rem' }}>
                {saveError}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
