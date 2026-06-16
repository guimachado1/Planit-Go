import { useCallback, useEffect, useState } from 'react';
import * as tripsApi from '../api/trips.js';
import * as expensesApi from '../api/expenses.js';
import * as itineraryApi from '../api/itinerary.js';
import { getApiErrorMessage } from '../utils/errors.js';

export function useTripReport(tripId) {
  const [trip, setTrip] = useState(null);
  const [summary, setSummary] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    setError('');
    try {
      const [tripData, summaryData, itineraryData] = await Promise.all([
        tripsApi.getTrip(tripId),
        expensesApi.getFinancialSummary(tripId),
        itineraryApi.getItinerary(tripId),
      ]);
      setTrip(tripData);
      setSummary(summaryData);
      setItinerary(itineraryData);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar o relatório.'));
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    load();
  }, [load]);

  return { trip, summary, itinerary, loading, error, reload: load };
}
