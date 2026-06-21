import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getTripCardCoverStyle,
  getTripCoverStyle,
  getTripStatus,
  resolveTripDisplayStatus,
} from './tripVisuals.js';

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

describe('getTripCardCoverStyle', () => {
  it('retorna imagem do perfil', () => {
    const style = getTripCardCoverStyle('beach');
    expect(style.backgroundImage).toContain('unsplash.com');
    expect(style.backgroundImage).toContain('photo-1507525428034');
  });

  it('usa urban como fallback', () => {
    const style = getTripCardCoverStyle('desconhecido');
    expect(style.backgroundImage).toContain('photo-1480714378408');
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
    expect(status.status).toBe('in_progress');
    expect(status.label).toBe('Em andamento');
    expect(status.variant).toBe('success');
  });

  it('identifica viagem planejada', () => {
    const status = getTripStatus('2026-07-01', '2026-07-10');
    expect(status.status).toBe('planned');
    expect(status.label).toBe('Planejada');
    expect(status.variant).toBe('primary');
  });

  it('identifica viagem finalizada', () => {
    const status = getTripStatus('2026-01-01', '2026-01-10');
    expect(status.status).toBe('completed');
    expect(status.label).toBe('Finalizada');
    expect(status.variant).toBe('muted');
  });

  it('no último dia da viagem permanece em andamento', () => {
    const status = getTripStatus('2026-06-10', '2026-06-15');
    expect(status.status).toBe('in_progress');
  });
});

describe('resolveTripDisplayStatus', () => {
  it('usa status da API quando disponível', () => {
    const status = resolveTripDisplayStatus({
      status: 'planned',
      statusLabel: 'Planejada',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
    });

    expect(status.label).toBe('Planejada');
    expect(status.status).toBe('planned');
  });

  it('calcula status quando API não envia', () => {
    const status = resolveTripDisplayStatus({
      startDate: '2026-06-01',
      endDate: '2026-06-30',
    });

    expect(status.status).toBe('in_progress');
  });
});
