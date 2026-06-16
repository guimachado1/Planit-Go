import { beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const post = vi.fn();

vi.mock('./client.js', () => ({
  default: { get, post },
}));

const { listExpenses, createExpense, getFinancialSummary } = await import(
  './expenses.js'
);

describe('expenses api', () => {
  beforeEach(() => {
    get.mockReset();
    post.mockReset();
  });

  it('listExpenses normaliza campos', async () => {
    get.mockResolvedValue({
      data: {
        expenses: [
          {
            id: '1',
            trip_id: 't1',
            category: 'food',
            amount: '50.00',
            spent_at: '2026-09-02',
            description: null,
            created_at: '2026-09-02',
          },
        ],
      },
    });

    const rows = await listExpenses('t1');
    expect(rows[0].tripId).toBe('t1');
    expect(rows[0].spentAt).toBe('2026-09-02');
  });

  it('createExpense envia payload', async () => {
    post.mockResolvedValue({
      data: {
        expense: {
          id: '2',
          trip_id: 't1',
          category: 'transport',
          amount: '30.00',
          spent_at: '2026-09-03',
          description: 'Uber',
          created_at: '2026-09-03',
        },
      },
    });

    const expense = await createExpense('t1', {
      category: 'transport',
      amount: 30,
      spentAt: '2026-09-03',
      description: 'Uber',
    });

    expect(post).toHaveBeenCalledWith('/api/trips/t1/expenses', {
      category: 'transport',
      amount: 30,
      spentAt: '2026-09-03',
      description: 'Uber',
    });
    expect(expense.category).toBe('transport');
  });

  it('getFinancialSummary retorna resumo', async () => {
    get.mockResolvedValue({ data: { summary: { totalBudget: 1000 } } });
    const summary = await getFinancialSummary('t1');
    expect(summary.totalBudget).toBe(1000);
  });
});
