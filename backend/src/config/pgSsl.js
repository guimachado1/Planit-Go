/**
 * SSL para PostgreSQL (ex.: Amazon RDS).
 * DATABASE_SSL: "true" | "false" | "auto" (default: auto → SSL em NODE_ENV=production)
 */
export function getPgSsl() {
  const mode = process.env.DATABASE_SSL || 'auto';
  if (mode === 'false') return undefined;
  if (
    mode === 'true' ||
    (mode === 'auto' && process.env.NODE_ENV === 'production')
  ) {
    return { rejectUnauthorized: false };
  }
  return undefined;
}

export function getPgClientConfig(connectionString) {
  const ssl = getPgSsl();
  return ssl ? { connectionString, ssl } : { connectionString };
}
