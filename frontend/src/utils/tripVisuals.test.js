import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTripCoverStyle, getTripStatus } from './tripVisuals.js';

describe('getTripCoverStyle', () => {
  it('retorna gradiente do perfil', () => {
    const style = getTripCoverStyle('beach');
    expect(style.background).toContain('linear-gradient');
  });

  it('usa urban como fallback', () => {
    const style = getTripCoverStyle('desconhecido');
    expect(style.background).toContain('#0369a1');
  });
});

describe('getTripStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('identifica viagem em andamento', () => {
    const status = getTripStatus('2026-06-01', '2026-06-30');
    expect(status.key).toBe('ongoing');
    expect(status.label).toBe('Em andamento');
  });

  it('identifica viagem futura com dias restantes', () => {
    const status = getTripStatus('2026-07-01', '2026-07-10');
    expect(status.key).toBe('upcoming');
    expect(status.label).toMatch(/dias/);
  });

  it('identifica viagem concluída', () => {
    const status = getTripStatus('2026-01-01', '2026-01-10');
    expect(status.key).toBe('past');
    expect(status.label).toBe('Concluída');
  });
});
