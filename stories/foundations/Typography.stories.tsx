import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = { title: "Foundations/Typography" };
export default meta;

/**
 * The scale is token-driven. Nothing here hardcodes a size, weight or
 * measure: if a value appears literally in this file it is a value the
 * system does not yet name, which is a gap to close rather than a number
 * to type. `tests/tokens.test.ts` gates the reference direction — a story
 * cannot point at a token that does not exist.
 */
const SCALE = [
  { token: "5xl", role: "Display — marketing headline", leading: "tight", tracking: "tight" },
  { token: "4xl", role: "Page title, marketing", leading: "tight", tracking: "tight" },
  { token: "3xl", role: "Section heading", leading: "tight", tracking: "tight" },
  { token: "2xl", role: "Screen title", leading: "snug", tracking: "normal" },
  { token: "xl", role: "Panel heading", leading: "snug", tracking: "normal" },
  { token: "lg", role: "Lede, callout", leading: "normal", tracking: "normal" },
  { token: "base", role: "Body", leading: "normal", tracking: "normal" },
  { token: "sm", role: "Secondary, table cells", leading: "normal", tracking: "normal" },
  { token: "xs", role: "Labels, axis ticks", leading: "snug", tracking: "wide" },
] as const;

export const Scale: StoryObj = {
  render: () => (
    <div style={{ padding: "var(--hp-space-8)", display: "grid", gap: "var(--hp-space-6)" }}>
      {SCALE.map(({ token, role, leading, tracking }) => (
        <div key={token} style={{ display: "grid", gap: "var(--hp-space-1)" }}>
          <div
            style={{
              fontSize: "var(--hp-text-xs)",
              fontFamily: "var(--hp-font-mono)",
              color: "var(--hp-color-fg-muted)",
              letterSpacing: "var(--hp-tracking-wide)",
            }}
          >
            --hp-text-{token} · {role}
          </div>
          <div
            style={{
              fontSize: `var(--hp-text-${token})`,
              lineHeight: `var(--hp-leading-${leading})`,
              letterSpacing: `var(--hp-tracking-${tracking})`,
              fontWeight: "var(--hp-weight-semibold)" as unknown as number,
              color: "var(--hp-color-fg)",
              textWrap: "balance",
            }}
          >
            Records climbed 12% this week
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Weights: StoryObj = {
  render: () => (
    <div style={{ padding: "var(--hp-space-8)", display: "grid", gap: "var(--hp-space-4)" }}>
      {(["regular", "medium", "semibold"] as const).map((w) => (
        <div
          key={w}
          style={{
            fontSize: "var(--hp-text-lg)",
            fontWeight: `var(--hp-weight-${w})` as unknown as number,
            color: "var(--hp-color-fg)",
          }}
        >
          {w} — 1,284,003 records
        </div>
      ))}
    </div>
  ),
};

/**
 * Figures in a metrics UI must not jitter as they update, so data uses
 * `font-variant-numeric: var(--hp-font-numeric)`. Proportional figures are
 * shown alongside to make the difference visible rather than asserted.
 */
export const TabularFigures: StoryObj = {
  render: () => (
    <div style={{ padding: "var(--hp-space-8)", display: "grid", gap: "var(--hp-space-6)" }}>
      {(
        [
          ["Tabular (used for data)", "var(--hp-font-numeric)"],
          ["Proportional (default)", "normal"],
        ] as const
      ).map(([label, variant]) => (
        <div key={label} style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <div style={{ fontSize: "var(--hp-text-xs)", color: "var(--hp-color-fg-muted)" }}>
            {label}
          </div>
          <div
            style={{
              fontVariantNumeric: variant,
              fontSize: "var(--hp-text-xl)",
              color: "var(--hp-color-fg)",
              display: "grid",
              gap: "var(--hp-space-1)",
            }}
          >
            <span>1,111,111</span>
            <span>8,048,003</span>
            <span>1,284,910</span>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Prose: StoryObj = {
  render: () => (
    <p
      style={{
        padding: "var(--hp-space-8)",
        maxWidth: "68ch",
        fontSize: "var(--hp-text-base)",
        lineHeight: "var(--hp-leading-relaxed)",
        color: "var(--hp-color-fg)",
        textWrap: "pretty",
      }}
    >
      Body copy sits at 68 characters, inside the 65–75ch band that keeps a
      reader’s eye from losing the line. Documentation surfaces inherit this
      system, so the measure has to hold for real prose and not only for the
      short labels a dashboard is made of.
    </p>
  ),
};
