function formatIsoDateParts(y, m, d) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Normaliza qualquer valor de data para YYYY-MM-DD (DATE do Postgres, Date JS, ISO string). */
export function normalizeDateOnly(value) {
  if (value == null || value === '') return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return formatIsoDateParts(
      value.getUTCFullYear(),
      value.getUTCMonth() + 1,
      value.getUTCDate()
    );
  }

  const s = String(value).trim();
  const isoPrefix = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoPrefix) {
    return `${isoPrefix[1]}-${isoPrefix[2]}-${isoPrefix[3]}`;
  }

  const parsed = new Date(s);
  if (!Number.isNaN(parsed.getTime())) {
    return formatIsoDateParts(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth() + 1,
      parsed.getUTCDate()
    );
  }

  return null;
}
