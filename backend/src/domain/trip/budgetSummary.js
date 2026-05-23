/**
 * @param {number|string} totalBudget
 * @param {Array<{ plannedAmount: string }>} lines
 */
export function buildBudgetSummary(totalBudget, lines) {
  const total = Number(totalBudget);
  const allocated = lines.reduce(
    (sum, line) => sum + Number(line.plannedAmount),
    0
  );
  const allocatedRounded = Math.round(allocated * 100) / 100;
  const unallocated = Math.round((total - allocatedRounded) * 100) / 100;

  return {
    totalBudget: total.toFixed(2),
    allocatedTotal: allocatedRounded.toFixed(2),
    unallocated: unallocated.toFixed(2),
  };
}
