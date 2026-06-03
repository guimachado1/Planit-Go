/** Valores enviados à API — labels só na UI */
export const TRIP_PROFILES = [
  { value: 'urban', label: 'Urbana / Cidade grande' },
  { value: 'beach', label: 'Praia / Lazer' },
  { value: 'international', label: 'Internacional' },
  { value: 'backpacker', label: 'Econômica / Mochilão' },
];

export function getProfileLabel(value) {
  return TRIP_PROFILES.find((p) => p.value === value)?.label ?? value;
}
