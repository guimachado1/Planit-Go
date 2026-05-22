/**
 * Perfis da viagem (RFC + escopo do produto).
 * Percentuais somam 100 por perfil; categorias fixas RF02.
 */
export const TRIP_PROFILES = Object.freeze({
  urban: {
    key: 'urban',
    label: 'Urbana / Cidade grande',
    transport: 20,
    accommodation: 25,
    food: 30,
    activities: 25,
  },
  beach: {
    key: 'beach',
    label: 'Praia / Lazer',
    transport: 15,
    accommodation: 35,
    food: 25,
    activities: 25,
  },
  international: {
    key: 'international',
    label: 'Internacional',
    transport: 40,
    accommodation: 25,
    food: 20,
    activities: 15,
  },
  backpacker: {
    key: 'backpacker',
    label: 'Econômica / Mochilão',
    transport: 35,
    accommodation: 20,
    food: 25,
    activities: 20,
  },
});

export const BUDGET_CATEGORIES = Object.freeze([
  'transport',
  'accommodation',
  'food',
  'activities',
]);

export function isValidProfileKey(profile) {
  return Object.prototype.hasOwnProperty.call(TRIP_PROFILES, profile);
}

/**
 * @param {keyof typeof TRIP_PROFILES} profileKey
 * @param {string} totalBudget - decimal string or number
 * @returns {Record<string, string>} category -> planned amount as decimal string (2 places)
 */
export function suggestBudgetByProfile(profileKey, totalBudget) {
  const p = TRIP_PROFILES[profileKey];
  const total = Number(totalBudget);
  if (!Number.isFinite(total) || total <= 0) {
    throw new Error('Invalid total budget');
  }
  const keys = ['transport', 'accommodation', 'food', 'activities'];
  const raw = keys.map((k) => ({ k, pct: p[k] }));
  const amounts = raw.map(({ k, pct }) => ({
    category: k,
    value: Math.floor((total * pct) / 100 * 100) / 100,
  }));
  const sum = amounts.reduce((a, b) => a + b.value, 0);
  const diff = Math.round((total - sum) * 100) / 100;
  if (diff !== 0 && amounts.length) {
    amounts[amounts.length - 1].value =
      Math.round((amounts[amounts.length - 1].value + diff) * 100) / 100;
  }
  return Object.fromEntries(
    amounts.map(({ category, value }) => [category, value.toFixed(2)])
  );
}
