import { useCallback, useEffect, useState } from 'react';
import * as tripsApi from '../api/trips.js';
import * as itineraryApi from '../api/itinerary.js';
import { getApiErrorMessage } from '../utils/errors.js';

export function useTripItinerary(tripId) {
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!tripId) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      const [tripData, itineraryData] = await Promise.all([
        tripsApi.getTrip(tripId),
        itineraryApi.getItinerary(tripId),
      ]);
      setTrip(tripData);
      setItinerary(itineraryData);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar o itinerário.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tripId]);

  useEffect(() => {
    load();
  }, [load]);

  const addItem = useCallback(
    async (payload) => {
      await itineraryApi.createItineraryItem(tripId, payload);
      await load(true);
    },
    [tripId, load]
  );

  const updateItem = useCallback(
    async (itemId, payload) => {
      await itineraryApi.updateItineraryItem(tripId, itemId, payload);
      await load(true);
    },
    [tripId, load]
  );

  const removeItem = useCallback(
    async (itemId) => {
      await itineraryApi.deleteItineraryItem(tripId, itemId);
      await load(true);
    },
    [tripId, load]
  );

  return {
    trip,
    itinerary,
    loading,
    refreshing,
    error,
    reload: load,
    addItem,
    updateItem,
    removeItem,
  };
}
