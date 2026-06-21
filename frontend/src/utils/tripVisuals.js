/** Capas decorativas por perfil (API não envia imagem) */
import {
  TRIP_STATUS,
  TRIP_STATUS_LABELS,
  TRIP_STATUS_VARIANTS,
} from '../constants/tripStatus.js';

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

/** Imagens de capa nos cards da listagem (detalhe da viagem mantém gradiente) */
const CARD_COVER_IMAGES = {
  urban:
    'https://images.unsplash.com/photo-1480714378408-67cf980d5cd9?w=800&q=80',
  beach:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  international:
    'https://images.unsplash.com/photo-1436491865339-7a61a387ad84?w=800&q=80',
  backpacker:
    'https://images.unsplash.com/photo-1551632811-561732d54461?w=800&q=80',
};

/** Gradiente decorativo — usado no hero das páginas internas da viagem */
export function getTripCoverStyle(profile) {
  return {
    background: COVERS[profile] || COVERS.urban,
  };
}

/** Foto por perfil — usado apenas nos cards da tela inicial */
export function getTripCardCoverStyle(profile) {
  const image = CARD_COVER_IMAGES[profile] || CARD_COVER_IMAGES.urban;
  return {
    backgroundImage: `url(${image})`,
  };
}

function toDateOnly(value) {
  if (value == null || value === '') return null;
  const s = String(value).trim();
  const iso = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const parsed = new Date(s);
  if (Number.isNaN(parsed.getTime())) return null;
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Fase da viagem para exibição nos cards e detalhe.
 * @returns {{ status: string, label: string, variant: string }}
 */
export function getTripStatus(startDate, endDate, referenceDate = new Date()) {
  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);
  const today = toDateOnly(referenceDate);

  if (!start || !end || !today) {
    return {
      status: TRIP_STATUS.PLANNED,
      label: TRIP_STATUS_LABELS[TRIP_STATUS.PLANNED],
      variant: TRIP_STATUS_VARIANTS[TRIP_STATUS.PLANNED],
    };
  }

  if (today < start) {
    return {
      status: TRIP_STATUS.PLANNED,
      label: TRIP_STATUS_LABELS[TRIP_STATUS.PLANNED],
      variant: TRIP_STATUS_VARIANTS[TRIP_STATUS.PLANNED],
    };
  }

  if (today > end) {
    return {
      status: TRIP_STATUS.COMPLETED,
      label: TRIP_STATUS_LABELS[TRIP_STATUS.COMPLETED],
      variant: TRIP_STATUS_VARIANTS[TRIP_STATUS.COMPLETED],
    };
  }

  return {
    status: TRIP_STATUS.IN_PROGRESS,
    label: TRIP_STATUS_LABELS[TRIP_STATUS.IN_PROGRESS],
    variant: TRIP_STATUS_VARIANTS[TRIP_STATUS.IN_PROGRESS],
  };
}

/**
 * Usa status da API quando disponível; senão calcula no cliente.
 */
export function resolveTripDisplayStatus(trip) {
  if (trip?.status && trip?.statusLabel) {
    return {
      status: trip.status,
      label: trip.statusLabel,
      variant: TRIP_STATUS_VARIANTS[trip.status] ?? 'muted',
    };
  }
  return getTripStatus(trip.startDate, trip.endDate);
}
