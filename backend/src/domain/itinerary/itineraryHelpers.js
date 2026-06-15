import { normalizeDateOnly } from '../dateOnly.js';

const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function formatIsoDateParts(y, m, d) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export { normalizeDateOnly };

function addOneDay(isoDate) {
  const normalized = normalizeDateOnly(isoDate);
  if (!normalized || !DATE_ONLY_RE.test(normalized)) return null;
  const [y, m, d] = normalized.split('-').map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return formatIsoDateParts(
    next.getUTCFullYear(),
    next.getUTCMonth() + 1,
    next.getUTCDate()
  );
}

/** Lista inclusive de datas YYYY-MM-DD entre start e end. */
export function eachDayInRange(startDate, endDate) {
  const start = normalizeDateOnly(startDate);
  const end = normalizeDateOnly(endDate);
  if (!start || !end) {
    const err = new Error('Datas da viagem inválidas.');
    err.status = 400;
    throw err;
  }
  if (start > end) return [];

  const days = [];
  let current = start;
  while (current <= end) {
    days.push(current);
    const next = addOneDay(current);
    if (!next) break;
    current = next;
  }
  return days;
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export function normalizeStartTime(value) {
  if (value == null || value === '') return null;
  const s = String(value).trim();
  if (!TIME_RE.test(s)) return undefined;
  return s.length === 5 ? `${s}:00` : s;
}

export function validateItemPayload(body, trip) {
  const dayDate = body.dayDate ?? body.day_date;
  if (!dayDate) {
    return { error: 'Informe o dia da atividade (dayDate).', status: 400 };
  }

  const day = normalizeDateOnly(dayDate);
  if (!day) {
    return { error: 'Data da atividade inválida.', status: 400 };
  }

  const tripStart = normalizeDateOnly(trip.start_date);
  const tripEnd = normalizeDateOnly(trip.end_date);
  if (!tripStart || !tripEnd) {
    return { error: 'Datas da viagem inválidas.', status: 400 };
  }

  if (day < tripStart || day > tripEnd) {
    return {
      error: 'A data deve estar dentro do período da viagem.',
      status: 400,
    };
  }

  const title = body.title != null ? String(body.title).trim() : '';
  if (title.length < 2) {
    return { error: 'Título deve ter pelo menos 2 caracteres.', status: 400 };
  }
  if (title.length > 500) {
    return { error: 'Título muito longo (máx. 500 caracteres).', status: 400 };
  }

  const startTime = normalizeStartTime(body.startTime ?? body.start_time);
  if (startTime === undefined) {
    return { error: 'Horário inválido. Use HH:MM.', status: 400 };
  }

  const description =
    body.description != null ? String(body.description).slice(0, 2000) : null;

  return {
    data: {
      dayDate: day,
      title,
      description: description?.trim() ? description.trim() : null,
      startTime,
    },
  };
}

export function mapItineraryItem(row) {
  const startTime = row.start_time;
  return {
    id: row.id,
    tripId: row.trip_id ?? row.tripId,
    dayDate: normalizeDateOnly(row.day_date ?? row.dayDate),
    title: row.title,
    description: row.description,
    startTime:
      startTime != null ? String(startTime).slice(0, 5) : null,
    sortOrder: row.sort_order ?? row.sortOrder ?? 0,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

export function buildItineraryResponse(trip, items) {
  const startDate = normalizeDateOnly(trip.start_date);
  const endDate = normalizeDateOnly(trip.end_date);
  const daysInRange = eachDayInRange(startDate, endDate);
  const byDate = Object.fromEntries(daysInRange.map((d) => [d, []]));

  for (const item of items) {
    const normalized = item.dayDate != null ? item : mapItineraryItem(item);
    const key = normalizeDateOnly(normalized.dayDate);
    if (key && byDate[key]) {
      byDate[key].push(normalized);
    }
  }

  const days = daysInRange.map((date, index) => ({
    date,
    dayNumber: index + 1,
    items: (byDate[date] ?? []).sort((a, b) => {
      const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (orderDiff !== 0) return orderDiff;
      const ta = a.startTime ?? '99:99';
      const tb = b.startTime ?? '99:99';
      return ta.localeCompare(tb);
    }),
  }));

  return {
    tripId: trip.id,
    destination: trip.destination,
    startDate,
    endDate,
    days,
  };
}
