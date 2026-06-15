/** Valores internos — espelham a API. */
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

export const TRIP_STATUS_VARIANTS = {
  [TRIP_STATUS.PLANNED]: 'primary',
  [TRIP_STATUS.IN_PROGRESS]: 'success',
  [TRIP_STATUS.COMPLETED]: 'muted',
};
