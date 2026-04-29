// ─────────────────────────────────────────────────
// Centralized constants for the SCRS frontend
// ─────────────────────────────────────────────────

/** Issue types for the report form */
export const ISSUE_OPTIONS = [
  'Pothole',
  'Broken Streetlight',
  'Water Leak',
  'Road Damage',
  'Other',
];

/** Road types expected by the backend */
export const ROAD_TYPE_OPTIONS = [
  { value: 'main_road', label: 'Main Road' },
  { value: 'highway', label: 'Highway' },
  { value: 'residential', label: 'Residential Road' },
  { value: 'lane', label: 'Lane / Gali' },
  { value: 'other', label: 'Other' },
];

/** Valid pothole status values from the backend */
export const STATUS_VALUES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};
