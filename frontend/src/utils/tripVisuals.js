/** Capas decorativas por perfil (API não envia imagem) */
const COVERS = {
  urban:
    'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%)',
  beach:
    'linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #0d9488 100%)',
  international:
    'linear-gradient(135deg, #4f46e5 0%, #0284c7 55%, #06b6d4 100%)',
  backpacker:
    'linear-gradient(135deg, #15803d 0%, #0d9488 50%, #0284c7 100%)',
};

export function getTripCoverStyle(profile) {
  return {
    background: COVERS[profile] || COVERS.urban,
  };
}

export function getTripStatus(startDate, endDate) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  if (today >= start && today <= end) {
    return { key: 'ongoing', label: 'Em andamento', variant: 'success' };
  }
  if (today < start) {
    const days = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    return { key: 'upcoming', label: `${days} dias`, variant: 'primary' };
  }
  return { key: 'past', label: 'Concluída', variant: 'muted' };
}
