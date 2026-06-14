/** RF06 — limiares de alerta por categoria (% do planejado). */
export const BUDGET_ALERT_WARNING_PERCENT = 80;

/**
 * @param {number|null} percentUsed
 * @returns {'ok'|'warning'|'over'}
 */
export function resolveBudgetAlertLevel(percentUsed) {
  if (percentUsed == null || !Number.isFinite(percentUsed)) {
    return 'ok';
  }
  if (percentUsed > 100) {
    return 'over';
  }
  if (percentUsed >= BUDGET_ALERT_WARNING_PERCENT) {
    return 'warning';
  }
  return 'ok';
}

const ALERT_LABELS = Object.freeze({
  ok: 'Dentro do limite',
  warning: 'Atenção',
  over: 'Orçamento ultrapassado',
});

/**
 * @param {'ok'|'warning'|'over'} level
 */
export function getBudgetAlertLabel(level) {
  return ALERT_LABELS[level] ?? ALERT_LABELS.ok;
}

function roundPercent(spent, planned) {
  if (!Number.isFinite(planned) || planned <= 0) {
    return null;
  }
  const s = Number(spent);
  if (!Number.isFinite(s)) {
    return null;
  }
  return Math.round((s / planned) * 1000) / 10;
}

/**
 * @param {{ category: string, planned: number, spent: number, remaining?: number }} row
 */
export function enrichCategoryWithAlert(row) {
  const percentUsed = roundPercent(row.spent, row.planned);
  const alertLevel = resolveBudgetAlertLevel(percentUsed);
  return {
    ...row,
    percentUsed,
    alertLevel,
    alertLabel: getBudgetAlertLabel(alertLevel),
  };
}

/**
 * @param {Array<{ category: string, planned: number, spent: number }>} byCategory
 * @param {number} totalBudget
 * @param {number} totalSpent
 */
export function buildBudgetAlertSummary(byCategory, totalBudget, totalSpent) {
  const categories = byCategory.map(enrichCategoryWithAlert);
  const overallPercent = roundPercent(totalSpent, totalBudget);
  const overallLevel = resolveBudgetAlertLevel(overallPercent);

  const activeAlerts = categories.filter(
    (c) => c.planned > 0 && c.alertLevel !== 'ok'
  );

  return {
    byCategory: categories,
    alerts: {
      overall: {
        percentUsed: overallPercent,
        alertLevel: overallLevel,
        alertLabel: getBudgetAlertLabel(overallLevel),
      },
      active: activeAlerts.map(({ category, percentUsed, alertLevel, alertLabel }) => ({
        category,
        percentUsed,
        alertLevel,
        alertLabel,
      })),
    },
  };
}
