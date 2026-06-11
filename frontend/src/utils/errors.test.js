import { describe, expect, it } from 'vitest';
import { getApiErrorMessage } from './errors.js';

describe('getApiErrorMessage', () => {
  it('prioriza mensagem da API', () => {
    const err = { response: { data: { error: 'E-mail já cadastrado.' } } };
    expect(getApiErrorMessage(err)).toBe('E-mail já cadastrado.');
  });

  it('usa err.message quando não há response', () => {
    expect(getApiErrorMessage(new Error('falha de rede'))).toBe('falha de rede');
  });

  it('usa fallback customizado', () => {
    expect(getApiErrorMessage({}, 'Algo deu errado.')).toBe('Algo deu errado.');
  });
});
