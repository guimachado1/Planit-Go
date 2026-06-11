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
