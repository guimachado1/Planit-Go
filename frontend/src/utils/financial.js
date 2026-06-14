/**
 * Percentual do planejado já gasto (0–100+). planned <= 0 → null.
 */
export function percentUsed(spent, planned) {
  const s = Number(spent);
  const p = Number(planned);
  if (!Number.isFinite(s) || !Number.isFinite(p) || p <= 0) {
    return null;
  }
  return Math.round((s / p) * 1000) / 10;
}

export function isOverBudget(spent, planned) {
  return Number(spent) > Number(planned);
}

/** RF06 — mesmo limiar do backend (80%). */
export const BUDGET_ALERT_WARNING_PERCENT = 80;

/**
 * @param {number|null} percent
 * @returns {'ok'|'warning'|'over'}
 */
export function resolveBudgetAlertLevel(percent) {
  if (percent == null || !Number.isFinite(percent)) {
    return 'ok';
  }
  if (percent > 100) {
    return 'over';
  }
  if (percent >= BUDGET_ALERT_WARNING_PERCENT) {
    return 'warning';
  }
  return 'ok';
}

const ALERT_LABELS = {
  ok: 'Dentro do limite',
  warning: 'Atenção',
  over: 'Orçamento ultrapassado',
};

/**
 * @param {'ok'|'warning'|'over'} level
 */
export function getBudgetAlertLabel(level) {
  return ALERT_LABELS[level] ?? ALERT_LABELS.ok;
}

/**
 * Resolve nível a partir de gasto e planejado (compatível com resumo da API).
 */
export function budgetAlertForAmounts(spent, planned) {
  const pct = percentUsed(spent, planned);
  const alertLevel = resolveBudgetAlertLevel(pct);
  return {
    percentUsed: pct,
    alertLevel,
    alertLabel: getBudgetAlertLabel(alertLevel),
  };
}

/**
 * @param {object} summary — resposta de GET /summary
 * @returns {Array<{ category: string, percentUsed: number|null, alertLevel: string, alertLabel: string }>}
 */
export function getActiveBudgetAlerts(summary) {
  if (!summary?.byCategory?.length) {
    return [];
  }
  if (summary.alerts?.active?.length) {
    return summary.alerts.active;
  }
  return summary.byCategory
    .filter((row) => Number(row.planned) > 0)
    .map((row) => {
      const alert = budgetAlertForAmounts(row.spent, row.planned);
      return {
        category: row.category,
        ...alert,
      };
    })
    .filter((row) => row.alertLevel !== 'ok');
}
