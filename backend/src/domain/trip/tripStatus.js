import { normalizeDateOnly } from '../dateOnly.js';

/** Valores internos expostos na API. */
export const TRIP_STATUS = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const TRIP_STATUS_LABELS = {
  [TRIP_STATUS.PLANNED]: 'Planejada',
  [TRIP_STATUS.IN_PROGRESS]: 'Em andamento',
  [TRIP_STATUS.COMPLETED]: 'Finalizada',
};

/**
 * Fase da viagem com base nas datas (comparação por dia civil, YYYY-MM-DD).
 * @param {string|Date|null|undefined} startDate
 * @param {string|Date|null|undefined} endDate
 * @param {Date} [referenceDate=new Date()]
 * @returns {{ status: string, label: string }}
 */
export function resolveTripStatus(startDate, endDate, referenceDate = new Date()) {
  const start = normalizeDateOnly(startDate);
  const end = normalizeDateOnly(endDate);
  const today = normalizeDateOnly(referenceDate);

  if (!start || !end || !today) {
    return {
      status: TRIP_STATUS.PLANNED,
      label: TRIP_STATUS_LABELS[TRIP_STATUS.PLANNED],
    };
  }

  if (today < start) {
    return {
      status: TRIP_STATUS.PLANNED,
      label: TRIP_STATUS_LABELS[TRIP_STATUS.PLANNED],
    };
  }

  if (today > end) {
    return {
      status: TRIP_STATUS.COMPLETED,
      label: TRIP_STATUS_LABELS[TRIP_STATUS.COMPLETED],
    };
  }

  return {
    status: TRIP_STATUS.IN_PROGRESS,
    label: TRIP_STATUS_LABELS[TRIP_STATUS.IN_PROGRESS],
  };
}
