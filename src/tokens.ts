/**
 * Token values mirrored for JS consumers.
 *
 * `tokens.css` is the source of truth for theming; this object exists for
 * tooling that needs values without a DOM, and carries the LIGHT theme.
 * tests/tokens.test.ts asserts every name and every color value here matches
 * the `:root` block, so the two cannot drift.
 */
export const tokens = {
  color: {
    bg: "oklch(1 0 0)",
    surface: "oklch(0.985 0 0)",
    "surface-raised": "oklch(0.965 0 0)",
    border: "oklch(0.90 0 0)",
    "border-strong": "oklch(0.78 0 0)",
    fg: "oklch(0.20 0 0)",
    "fg-muted": "oklch(0.435 0 0)",
    accent: "oklch(0.432 0.076 223.1)",
    "accent-fg": "oklch(1 0 0)",
    "accent-surface": "oklch(0.668 0.111 223.1)",
    "accent-surface-fg": "oklch(0.10 0 0)",
    "accent-alt": "oklch(0.442 0.091 69.1)",
    "accent-alt-fg": "oklch(1 0 0)",
    "accent-alt-surface": "oklch(0.787 0.171 69.1)",
    "accent-alt-surface-fg": "oklch(0.20 0 0)",
    success: "oklch(0.426 0.11 150)",
    warning: "oklch(0.442 0.088 75)",
    danger: "oklch(0.46 0.175 25)",
    "chart-1": "oklch(0.272 0.049 223.1)",
    "chart-2": "oklch(0.36 0.075 69.1)",
    "chart-3": "oklch(0.42 0.075 223.1)",
    "chart-4": "oklch(0.5 0.105 69.1)",
    "chart-5": "oklch(0.556 0.099 223.1)",
    "chart-6": "oklch(0.642 0.134 69.1)",
  },
  shadow: {
    ambient: "0 1px 2px rgb(0 0 0 / 0.05), 0 2px 8px rgb(0 0 0 / 0.04)",
    overlay: "0 4px 12px rgb(0 0 0 / 0.10), 0 12px 32px rgb(0 0 0 / 0.07)",
    modal: "0 8px 24px rgb(0 0 0 / 0.14), 0 24px 64px rgb(0 0 0 / 0.10)",
  },
  font: {
    sans: "ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
    numeric: "tabular-nums",
  },
  text: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.375rem",
    "2xl": "1.75rem",
    "3xl": "2.25rem",
    "4xl": "3rem",
    "5xl": "3.75rem",
  },
  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
  },
  leading: {
    tight: "1.2",
    snug: "1.35",
    normal: "1.55",
    relaxed: "1.7",
  },
  tracking: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.02em",
  },
  space: {
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
  },
  radius: {
    sm: "3px",
    md: "6px",
    lg: "10px",
  },
  z: {
    dropdown: "10",
    sticky: "20",
    "modal-backdrop": "30",
    modal: "40",
    toast: "50",
    tooltip: "60",
  },
  motion: {
    "duration-fast": "120ms",
    "duration-base": "200ms",
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
} as const;

export type Tokens = typeof tokens;
