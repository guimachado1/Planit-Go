import { Router } from 'express';
import { TRIP_PROFILES } from '../constants/tripProfiles.js';

const r = Router();

r.get('/trip-profiles', (_req, res) => {
  res.json({
    profiles: Object.values(TRIP_PROFILES).map((p) => ({
      key: p.key,
      label: p.label,
      percentages: {
        transport: p.transport,
        accommodation: p.accommodation,
        food: p.food,
        activities: p.activities,
      },
    })),
  });
});

export default r;
