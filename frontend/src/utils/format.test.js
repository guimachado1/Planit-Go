import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDateBR, formatDateRange, toInputDate } from './format.js';

describe('formatCurrency', () => {
  it('formata valor em BRL', () => {
    expect(formatCurrency(1234.5)).toMatch(/R\$\s*1\.234,50/);
  });

  it('retorna zero para valor inválido', () => {
    expect(formatCurrency('abc')).toBe('R$ 0,00');
  });
});

describe('formatDateBR', () => {
  it('converte ISO para dd/mm/aaaa', () => {
    expect(formatDateBR('2026-09-15')).toBe('15/09/2026');
  });

  it('retorna vazio para valor ausente', () => {
    expect(formatDateBR(null)).toBe('');
  });

  it('mantém valor quando formato é inválido', () => {
    expect(formatDateBR('data-invalida')).toBe('data-invalida');
  });
});

describe('formatDateRange', () => {
  it('monta intervalo amigável', () => {
    expect(formatDateRange('2026-09-01', '2026-09-05')).toBe(
      '01/09/2026 – 05/09/2026'
    );
  });
});

describe('toInputDate', () => {
  it('converte ISO para input date', () => {
    expect(toInputDate('2026-09-15')).toBe('2026-09-15');
  });

  it('retorna vazio para valor ausente', () => {
    expect(toInputDate(null)).toBe('');
  });
});
