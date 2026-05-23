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
