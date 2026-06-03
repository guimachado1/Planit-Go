export function formatCurrency(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n);
}

/** Exibição amigável; API usa YYYY-MM-DD */
export function formatDateBR(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = String(isoDate).slice(0, 10).split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

export function formatDateRange(startDate, endDate) {
  return `${formatDateBR(startDate)} – ${formatDateBR(endDate)}`;
}
