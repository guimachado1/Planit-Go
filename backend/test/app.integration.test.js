import '../test-support/setupEnv.js';
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { env } from '../src/config/env.js';
import {
  createMockClient,
  installPoolMock,
  onPoolConnect,
  onPoolQuery,
  restorePoolMock,
} from '../test-support/mockPool.js';

const userId = '550e8400-e29b-41d4-a716-446655440000';
const tripId = '660e8400-e29b-41d4-a716-446655440001';

let passwordHash = '';

const userRow = {
  id: userId,
  email: 'teste@example.com',
  password_hash: '',
  full_name: 'Teste User',
  created_at: new Date('2026-01-01'),
};

const tripRow = {
  id: tripId,
  user_id: userId,
  destination: 'Curitiba',
  start_date: '2026-09-01',
  end_date: '2026-09-05',
  total_budget: '1000.00',
  profile: 'urban',
  created_at: new Date('2026-01-01'),
  updated_at: new Date('2026-01-01'),
};

const budgetLines = [
  { category: 'transport', planned_amount: '200.00' },
  { category: 'accommodation', planned_amount: '250.00' },
  { category: 'food', planned_amount: '300.00' },
  { category: 'activities', planned_amount: '250.00' },
];

function authHeader() {
  const token = jwt.sign(
    { sub: userId, email: userRow.email },
    env.jwtSecret
  );
  return { Authorization: `Bearer ${token}` };
}

beforeEach(async () => {
  installPoolMock();
  passwordHash = await bcrypt.hash('senha12345', 12);
  userRow.password_hash = passwordHash;
});

afterEach(() => {
  restorePoolMock();
});

test('GET /health responde ok', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.service, 'planit-go-api');
});

test('GET /api/trip-profiles lista perfis', async () => {
  const res = await request(app).get('/api/trip-profiles');
  assert.equal(res.status, 200);
  assert.equal(res.body.profiles.length, 4);
  assert.ok(res.body.profiles.some((p) => p.key === 'urban'));
});

test('POST /api/auth/register cria conta', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM users')) {
      return { rows: [] };
    }
    if (sql.includes('INSERT INTO users')) {
      return { rows: [userRow] };
    }
    return { rows: [] };
  });

  const res = await request(app).post('/api/auth/register').send({
    email: 'teste@example.com',
    password: 'senha12345',
    fullName: 'Teste User',
    acceptPrivacyPolicy: true,
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.user.email, 'teste@example.com');
  assert.ok(res.body.token);
});

test('POST /api/auth/login autentica usuário', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM users')) {
      return { rows: [userRow] };
    }
    return { rows: [] };
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'teste@example.com',
    password: 'senha12345',
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.user.id, userId);
  assert.ok(res.body.token);
});

test('GET /api/auth/me retorna usuário autenticado', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM users')) {
      return { rows: [userRow] };
    }
    return { rows: [] };
  });

  const res = await request(app)
    .get('/api/auth/me')
    .set(authHeader());

  assert.equal(res.status, 200);
  assert.equal(res.body.user.email, userRow.email);
});

test('POST /api/trips/budget/suggest exige autenticação', async () => {
  const res = await request(app)
    .post('/api/trips/budget/suggest')
    .send({ profile: 'urban', totalBudget: 1000 });

  assert.equal(res.status, 401);
});

test('POST /api/trips/budget/suggest retorna sugestão', async () => {
  const res = await request(app)
    .post('/api/trips/budget/suggest')
    .set(authHeader())
    .send({ profile: 'urban', totalBudget: 1000 });

  assert.equal(res.status, 200);
  assert.equal(res.body.profile, 'urban');
  assert.equal(res.body.suggested.transport, '200.00');
});

test('POST /api/trips cria viagem autenticada', async () => {
  onPoolConnect(() =>
    createMockClient((sql) => {
      if (sql === 'BEGIN' || sql === 'COMMIT') {
        return { rows: [] };
      }
      if (sql.includes('INSERT INTO trips')) {
        return { rows: [tripRow] };
      }
      if (sql.includes('INSERT INTO trip_budget_lines')) {
        return { rows: [] };
      }
      return { rows: [] };
    })
  );
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips WHERE')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('trip_budget_lines')) {
      return { rows: budgetLines };
    }
    return { rows: [] };
  });

  const res = await request(app)
    .post('/api/trips')
    .set(authHeader())
    .send({
      destination: 'Curitiba',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      totalBudget: 1000,
      profile: 'urban',
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.trip.destination, 'Curitiba');
});

test('GET /api/trips lista viagens do usuário', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('ORDER BY start_date')) {
      return { rows: [tripRow] };
    }
    return { rows: [] };
  });

  const res = await request(app).get('/api/trips').set(authHeader());

  assert.equal(res.status, 200);
  assert.equal(res.body.trips.length, 1);
});

test('GET /api/trips/:id retorna detalhe', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips WHERE')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('trip_budget_lines')) {
      return { rows: budgetLines };
    }
    return { rows: [] };
  });

  const res = await request(app)
    .get(`/api/trips/${tripId}`)
    .set(authHeader());

  assert.equal(res.status, 200);
  assert.equal(res.body.trip.id, tripId);
});

test('POST /api/trips/:tripId/expenses registra gasto', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('INSERT INTO expenses')) {
      return {
        rows: [
          {
            id: 'exp-1',
            trip_id: tripId,
            category: 'food',
            amount: '45.00',
            spent_at: '2026-09-02',
            description: null,
            created_at: new Date(),
          },
        ],
      };
    }
    return { rows: [] };
  });

  const res = await request(app)
    .post(`/api/trips/${tripId}/expenses`)
    .set(authHeader())
    .send({ category: 'food', amount: 45, spentAt: '2026-09-02' });

  assert.equal(res.status, 201);
  assert.equal(res.body.expense.category, 'food');
});

test('GET /api/trips/:tripId/summary retorna resumo financeiro', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips WHERE')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('trip_budget_lines')) {
      return { rows: budgetLines };
    }
    if (sql.includes('GROUP BY category')) {
      return { rows: [{ category: 'food', total: '50.00' }] };
    }
    return { rows: [] };
  });

  const res = await request(app)
    .get(`/api/trips/${tripId}/summary`)
    .set(authHeader());

  assert.equal(res.status, 200);
  assert.equal(res.body.summary.totalBudget, 1000);
});

test('POST /api/trips/budget/preview valida ajuste manual', async () => {
  const res = await request(app)
    .post('/api/trips/budget/preview')
    .set(authHeader())
    .send({
      profile: 'urban',
      totalBudget: 1000,
      categoryAmounts: {
        transport: 250,
        accommodation: 250,
        food: 250,
        activities: 250,
      },
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.distributionMode, 'manual');
});

test('GET /api/trips/:tripId/expenses lista gastos', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('FROM expenses')) {
      return {
        rows: [
          {
            id: 'exp-1',
            category: 'food',
            amount: '30.00',
            spent_at: '2026-09-02',
            description: null,
            created_at: new Date(),
          },
        ],
      };
    }
    return { rows: [] };
  });

  const res = await request(app)
    .get(`/api/trips/${tripId}/expenses`)
    .set(authHeader());

  assert.equal(res.status, 200);
  assert.equal(res.body.expenses.length, 1);
});

test('rotas protegidas propagam erro de validação', async () => {
  const res = await request(app)
    .post('/api/trips/budget/suggest')
    .set(authHeader())
    .send({ profile: 'invalido', totalBudget: 1000 });

  assert.equal(res.status, 400);
  assert.ok(res.body.error);
});
