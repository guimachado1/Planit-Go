/** Chaves da API — labels traduzidos na UI */
export const BUDGET_CATEGORIES = [
  {
    key: 'transport',
    label: 'Transporte',
    color: '#3b82f6',
  },
  {
    key: 'accommodation',
    label: 'Hospedagem',
    color: '#6366f1',
  },
  {
    key: 'food',
    label: 'Alimentação',
    color: '#f97316',
  },
  {
    key: 'activities',
    label: 'Atividades',
    color: '#22c55e',
  },
];

export function getCategoryLabel(key) {
  return BUDGET_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export const EMPTY_CATEGORY_AMOUNTS = () =>
  Object.fromEntries(BUDGET_CATEGORIES.map((c) => [c.key, 0]));
