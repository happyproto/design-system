/**
 * Design tokens for the HappyProto control plane.
 *
 * PROVISIONAL VALUES. The token *names* are the public API and are settled;
 * the color and type values are replaced by the designed language before
 * 1.0.0 is published. Do not build a palette on top of these.
 */
export const tokens = {
  color: {
    bg: "oklch(0.99 0 0)",
    surface: "oklch(1 0 0)",
    "surface-raised": "oklch(0.97 0 0)",
    border: "oklch(0.90 0 0)",
    "border-strong": "oklch(0.80 0 0)",
    fg: "oklch(0.20 0 0)",
    "fg-muted": "oklch(0.44 0 0)",
    // L=0.42, not a mid-tone: white text on a mid-blue accent reaches only
    // 4.85:1, well under AAA. An accent that carries white text at 7:1 has
    // to be this dark. C=0.118, not 0.15, because 0.15 at this lightness
    // falls outside sRGB (r < 0). Measured, not guessed.
    accent: "oklch(0.42 0.118 250)",
    "accent-fg": "oklch(1 0 0)",
    success: "oklch(0.426 0.115 150)",
    warning: "oklch(0.442 0.09 75)",
    danger: "oklch(0.461 0.18 25)",
    "chart-1": "oklch(0.368 0.155 265)",
    "chart-2": "oklch(0.434 0.155 15)",
    "chart-3": "oklch(0.468 0.091 100)",
    "chart-4": "oklch(0.516 0.084 210)",
    "chart-5": "oklch(0.596 0.155 300)",
    "chart-6": "oklch(0.649 0.143 60)",
  },
  font: {
    sans: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
    display: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
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
  radius: { sm: "0.25rem", md: "0.5rem", lg: "0.75rem" },
  motion: {
    "duration-fast": "120ms",
    "duration-base": "200ms",
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
} as const;

export type Tokens = typeof tokens;
