import { describe, expect, it } from 'vitest';
import { TRIP_PROFILES, getProfileLabel } from './tripProfiles.js';

describe('tripProfiles', () => {
  it('lista quatro perfis', () => {
    expect(TRIP_PROFILES).toHaveLength(4);
  });

  it('resolve label conhecida', () => {
    expect(getProfileLabel('beach')).toBe('Praia / Lazer');
  });

  it('retorna value quando perfil é desconhecido', () => {
    expect(getProfileLabel('cruise')).toBe('cruise');
  });
});
