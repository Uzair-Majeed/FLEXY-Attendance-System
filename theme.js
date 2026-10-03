// Theme colors and styling definitions

export const colors = {
  // Backgrounds & surfaces
  background: '#0d0d0d',
  canvas: '#0d0d0d',
  card: '#1a1a19',
  surface: '#1a1a19',
  cardAlt: '#242422',
  surfaceAlt: '#242422',
  inputBg: '#141413',
  surfaceInput: '#141413',
  border: '#2c2c2a',
  borderStrong: '#383835',

  // Text colors
  text: '#ffffff',
  textSecondary: '#c3c2b7',
  textMuted: '#898781',
  onAccent: '#14131f',

  // Primary highlight color
  primary: '#9085e9',
  accent: '#9085e9',
  accentSoft: 'rgba(144, 133, 233, 0.15)',
  accentBorder: 'rgba(144, 133, 233, 0.45)',

  // Status & urgency colors
  danger: '#d03b3b',
  warning: '#c98500',
  warn: '#c98500',
  safe: '#3987e5',
  success: '#3987e5',
  muted: '#898781',

  // Transparent tint backgrounds for badges and alerts
  dangerSoft: 'rgba(208, 59, 59, 0.15)',
  warnSoft: 'rgba(201, 133, 0, 0.17)',
  safeSoft: 'rgba(57, 135, 229, 0.15)',
  mutedSoft: 'rgba(137, 135, 129, 0.15)',
};

// Helper for solid color and soft background pairs
export const tones = {
  danger: { solid: colors.danger, soft: colors.dangerSoft },
  warn: { solid: colors.warn, soft: colors.warnSoft },
  safe: { solid: colors.safe, soft: colors.safeSoft },
  muted: { solid: colors.muted, soft: colors.mutedSoft },
  accent: { solid: colors.accent, soft: colors.accentSoft },
  primary: { solid: colors.primary, soft: colors.accentSoft },
};

// Spacing scale for padding and margins
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Corner rounding radii
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

// Typography styles
export const type = {
  display: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontSize: 20, fontWeight: '700' },
  heading: { fontSize: 16, fontWeight: '700' },
  body: { fontSize: 14, fontWeight: '500' },
  small: { fontSize: 12, fontWeight: '500' },
  caption: { fontSize: 11, fontWeight: '600' },
};
