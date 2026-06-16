import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AppError } from '../src/errors/AppError.js';
import {
  parseMoney,
  resolveBudgetLines,
  validateCreateTripPayload,
  validateDestination,
  validateProfile,
  validateTotalBudget,
  validateUpdateTripPayload,
} from '../src/domain/trip/tripValidation.js';

test('perfil inválido é rejeitado', () => {
  assert.throws(
    () => validateProfile('invalid'),
    (err) => err instanceof AppError && err.message.includes('Perfil inválido')
  );
});

test('orçamento zero é rejeitado', () => {
  assert.throws(
    () => validateTotalBudget(0),
    (err) => err instanceof AppError
  );
});

test('orçamento negativo é rejeitado', () => {
  assert.throws(
    () => validateTotalBudget(-100),
    (err) => err instanceof AppError
  );
});

test('ajuste manual acima do total é rejeitado', () => {
  assert.throws(
    () =>
      resolveBudgetLines({
        profile: 'urban',
        totalBudget: 1000,
        categoryAmounts: {
          transport: 400,
          accommodation: 400,
          food: 300,
          activities: 100,
        },
      }),
    (err) =>
      err instanceof AppError &&
      err.message.includes('não pode ultrapassar')
  );
});

test('ajuste manual exige todas as categorias', () => {
  assert.throws(
    () =>
      resolveBudgetLines({
        profile: 'beach',
        totalBudget: 2000,
        categoryAmounts: {
          transport: 500,
          accommodation: 500,
        },
      }),
    (err) => err instanceof AppError && err.message.includes('categoria')
  );
});

test('categoria desconhecida no ajuste manual é rejeitada', () => {
  assert.throws(
    () =>
      resolveBudgetLines({
        profile: 'urban',
        totalBudget: 1000,
        categoryAmounts: {
          transport: 100,
          accommodation: 100,
          food: 100,
          activities: 100,
          souvenirs: 50,
        },
      }),
    (err) => err instanceof AppError && err.message.includes('Categoria inválida')
  );
});

test('ajuste manual abaixo do total é aceito com saldo não alocado', () => {
  const result = resolveBudgetLines({
    profile: 'urban',
    totalBudget: 1000,
    categoryAmounts: {
      transport: 200,
      accommodation: 200,
      food: 200,
      activities: 200,
    },
  });
  assert.equal(result.distributionMode, 'manual');
  assert.equal(result.summary.allocatedTotal, '800.00');
  assert.equal(result.summary.unallocated, '200.00');
});

test('distribuição automática sem categoryAmounts', () => {
  const result = resolveBudgetLines({
    profile: 'international',
    totalBudget: 3000,
    categoryAmounts: null,
  });
  assert.equal(result.distributionMode, 'automatic');
  assert.equal(result.summary.allocatedTotal, '3000.00');
  assert.equal(result.summary.unallocated, '0.00');
  assert.equal(result.lines.length, 4);
});

test('payload de criação válido monta viagem e orçamento', () => {
  const payload = validateCreateTripPayload({
    destination: 'Florianópolis',
    startDate: '2026-07-01',
    endDate: '2026-07-10',
    totalBudget: 4500,
    profile: 'beach',
  });
  assert.equal(payload.destination, 'Florianópolis');
  assert.equal(payload.profile, 'beach');
  assert.equal(payload.profileLabel, 'Praia / Lazer');
  assert.equal(payload.distributionMode, 'automatic');
  assert.equal(payload.lines.length, 4);
  const sum = payload.lines.reduce(
    (a, l) => a + Number(l.plannedAmount),
    0
  );
  assert.equal(sum, 4500);
});

test('datas inválidas na criação são rejeitadas', () => {
  assert.throws(
    () =>
      validateCreateTripPayload({
        destination: 'Teste',
        startDate: '10-07-2026',
        endDate: '2026-07-10',
        totalBudget: 1000,
        profile: 'urban',
      }),
    (err) => err instanceof AppError
  );
});

test('parseMoney rejeita valores inválidos', () => {
  assert.equal(parseMoney(null), null);
  assert.equal(parseMoney(''), null);
  assert.equal(parseMoney('abc'), null);
  assert.equal(parseMoney(12.345), 12.35);
});

test('destino muito curto ou longo é rejeitado', () => {
  assert.throws(
    () => validateDestination('A'),
    (err) => err instanceof AppError
  );
  assert.throws(
    () => validateDestination('x'.repeat(501)),
    (err) => err instanceof AppError && err.message.includes('longo')
  );
});

test('orçamento acima do limite é rejeitado', () => {
  assert.throws(
    () => validateTotalBudget(100_000_000),
    (err) => err instanceof AppError && err.message.includes('limite')
  );
});

test('valor negativo em categoria manual é rejeitado', () => {
  assert.throws(
    () =>
      resolveBudgetLines({
        profile: 'urban',
        totalBudget: 1000,
        categoryAmounts: {
          transport: -1,
          accommodation: 250,
          food: 250,
          activities: 250,
        },
      }),
    (err) => err instanceof AppError && err.message.includes('inválido')
  );
});

test('data final antes da inicial é rejeitada', () => {
  assert.throws(
    () =>
      validateCreateTripPayload({
        destination: 'Teste',
        startDate: '2026-07-10',
        endDate: '2026-07-01',
        totalBudget: 1000,
        profile: 'urban',
      }),
    (err) => err instanceof AppError
  );
});

test('validateUpdateTripPayload aceita datas válidas', () => {
  const result = validateUpdateTripPayload({
    startDate: '2026-08-01',
    endDate: '2026-08-10',
  });
  assert.equal(result.startDate, '2026-08-01');
  assert.equal(result.endDate, '2026-08-10');
});
