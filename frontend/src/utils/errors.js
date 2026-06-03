export function getApiErrorMessage(err, fallback = 'Ocorreu um erro. Tente novamente.') {
  return (
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}
