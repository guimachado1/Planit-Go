import { useCallback, useEffect, useState } from 'react';
import * as tripsApi from '../api/trips.js';
import * as expensesApi from '../api/expenses.js';
import { getApiErrorMessage } from '../utils/errors.js';

export function useTripFinances(tripId) {
  const [trip, setTrip] = useState(null);
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!tripId) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      const [tripData, summaryData, expensesData] = await Promise.all([
        tripsApi.getTrip(tripId),
        expensesApi.getFinancialSummary(tripId),
        expensesApi.listExpenses(tripId),
      ]);
      setTrip(tripData);
      setSummary(summaryData);
      setExpenses(expensesData);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar os dados da viagem.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tripId]);

  useEffect(() => {
    load();
  }, [load]);

  const addExpense = useCallback(
    async (payload) => {
      await expensesApi.createExpense(tripId, payload);
      await load(true);
    },
    [tripId, load]
  );

  const updateExpense = useCallback(
    async (expenseId, payload) => {
      await expensesApi.updateExpense(tripId, expenseId, payload);
      await load(true);
    },
    [tripId, load]
  );

  const deleteExpense = useCallback(
    async (expenseId) => {
      await expensesApi.deleteExpense(tripId, expenseId);
      await load(true);
    },
    [tripId, load]
  );

  return {
    trip,
    summary,
    expenses,
    loading,
    refreshing,
    error,
    reload: load,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
