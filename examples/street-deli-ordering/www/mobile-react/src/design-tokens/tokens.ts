/**
 * Design tokens extracted from the static prototype CSS.
 *
 * These tokens encode the DMETA design-language IR for the Street Deli instance.
 * Typography, color, spacing, radius, and role color constants.
 *
 * @see /examples/street-deli-ordering/02-design-language.yaml
 * @see /examples/street-deli-ordering/www/mobile/styles.css
 */

// ─── COLORS ───────────────────────────────────────────────────────────

export const colors = {
  // Neutrals
  bg: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  textPrimary: '#2C2520',
  textSecondary: '#7A7067',
  textMuted: '#A69E94',
  divider: '#E8E2DA',
  dividerStrong: '#D4CBC0',

  // Semantic
  info: '#3B7DD8',
  success: '#3A8A5C',
  warning: '#C4860B',
  danger: '#C43B3B',
  pending: '#8A8A8A',
  active: '#2B6CB0',

  // Accent -- warm avocado green
  accent: '#5B8C3E',
  accentLight: '#EAF2E3',
} as const;

// ─── INGREDIENT ROLE COLORS ───────────────────────────────────────────

export const roleColors: Record<string, { bg: string; text: string }> = {
  structural: { bg: '#FEF3CD', text: '#92650A' },
  protein: { bg: '#F5E6D8', text: '#6B3E20' },
  richness: { bg: '#EAF2E3', text: '#3D6B2E' },
  moisture: { bg: '#DBEAFE', text: '#1E5BA8' },
  acidity: { bg: '#ECFCD4', text: '#4D7A0A' },
  crunch: { bg: '#DCFCE7', text: '#15803D' },
  heat: { bg: '#FEE2E2', text: '#B91C1C' },
  umami: { bg: '#F5E6D8', text: '#7A5A3E' },
  garnish: { bg: '#DCFCE7', text: '#3B7A4A' },
  freshness: { bg: '#ECFDF5', text: '#166534' },
  binding: { bg: '#E0E7FF', text: '#4338CA' },
};

// ─── DIETARY BADGE COLORS ─────────────────────────────────────────────

export const dietaryBadgeColors: Record<string, { bg: string; text: string; border: string }> = {
  v: { bg: '#E8F5E9', text: '#2E7D32', border: 'rgba(46,125,50,0.2)' },   // Vegan
  vg: { bg: '#E8F5E9', text: '#388E3C', border: 'rgba(56,142,60,0.2)' },  // Vegetarian
  gf: { bg: '#FFF3E0', text: '#B8860B', border: 'rgba(184,134,11,0.2)' },  // Gluten-Free
  df: { bg: '#E3F0E8', text: '#3A8A5C', border: 'rgba(58,138,92,0.2)' },   // Dairy-Free
  nf: { bg: '#F0E6F6', text: '#7B3FA0', border: 'rgba(123,63,160,0.2)' },   // Nut-Free
};

// ─── SPACING ──────────────────────────────────────────────────────────

export const spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
} as const;

// ─── RADIUS ───────────────────────────────────────────────────────────

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 100,
} as const;

// ─── TOUCH TARGET ──────────────────────────────────────────────────────

/** Minimum touch target size in pixels (DMETA lint rule: touch_target_minimum) */
export const touchTarget = {
  min: 44,
} as const;

// ─── TYPOGRAPHY ────────────────────────────────────────────────────────

export const fontFamilies = {
  sans: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'SF Mono', 'Berkeley Mono', 'IBM Plex Mono', monospace",
} as const;

/**
 * Typography roles from the design-language IR.
 * Each role maps to a CSS style object.
 *
 * @see 02-design-language.yaml → typography.roles
 */
export const typography = {
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: '15px',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  metadata: {
    fontFamily: fontFamilies.mono,
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: 1.3,
  },
  label: {
    fontFamily: fontFamilies.sans,
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
  },
  title: {
    fontFamily: fontFamilies.sans,
    fontSize: '20px',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  price: {
    fontFamily: fontFamilies.mono,
    fontSize: '15px',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  roleTag: {
    fontFamily: fontFamilies.sans,
    fontSize: '9px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
  },
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: 1.3,
  },
  sectionHeading: {
    fontFamily: fontFamilies.sans,
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
} as const;

// ─── CSS CUSTOM PROPERTIES ─────────────────────────────────────────────

/**
 * Generate a CSS custom property block from the tokens.
 * Inject into :root for Tailwind compatibility and runtime access.
 */
export function generateCSSTokens(): Record<string, string> {
  const vars: Record<string, string> = {};
  vars['--bg'] = colors.bg;
  vars['--surface'] = colors.surface;
  vars['--text'] = colors.textPrimary;
  vars['--text-secondary'] = colors.textSecondary;
  vars['--text-muted'] = colors.textMuted;
  vars['--divider'] = colors.divider;
  vars['--divider-strong'] = colors.dividerStrong;
  vars['--accent'] = colors.accent;
  vars['--accent-light'] = colors.accentLight;
  vars['--info'] = colors.info;
  vars['--success'] = colors.success;
  vars['--warning'] = colors.warning;
  vars['--danger'] = colors.danger;
  vars['--pending'] = colors.pending;
  vars['--active'] = colors.active;
  vars['--font-sans'] = fontFamilies.sans;
  vars['--font-mono'] = fontFamilies.mono;
  vars['--r-sm'] = `${radius.sm}px`;
  vars['--r-md'] = `${radius.md}px`;
  vars['--r-lg'] = `${radius.lg}px`;
  vars['--r-full'] = `${radius.full}px`;
  vars['--touch-min'] = `${touchTarget.min}px`;
  // Spacing
  vars['--space-1'] = `${spacing.s1}px`;
  vars['--space-2'] = `${spacing.s2}px`;
  vars['--space-3'] = `${spacing.s3}px`;
  vars['--space-4'] = `${spacing.s4}px`;
  vars['--space-5'] = `${spacing.s5}px`;
  vars['--space-6'] = `${spacing.s6}px`;
  vars['--space-8'] = `${spacing.s8}px`;
  vars['--space-10'] = `${spacing.s10}px`;
  // Role colors
  for (const [role, c] of Object.entries(roleColors)) {
    vars[`--role-${role}`] = c.text;
  }
  return vars;
}
