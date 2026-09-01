import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = { title: "Foundations/Typography" };
export default meta;

const SIZES = [
  { label: "display", size: "2.5rem", weight: 600, family: "var(--hp-font-display)" },
  { label: "h1", size: "1.75rem", weight: 600, family: "var(--hp-font-display)" },
  { label: "h2", size: "1.25rem", weight: 600, family: "var(--hp-font-display)" },
  { label: "body", size: "1rem", weight: 400, family: "var(--hp-font-sans)" },
  { label: "small", size: "0.875rem", weight: 400, family: "var(--hp-font-sans)" },
  { label: "mono", size: "0.8125rem", weight: 400, family: "var(--hp-font-mono)" },
];

export const Scale: StoryObj = {
  render: () => (
    <div style={{ padding: "var(--hp-space-8)", display: "grid", gap: "var(--hp-space-6)" }}>
      {SIZES.map((s) => (
        <div key={s.label}>
          <code style={{ color: "var(--hp-color-fg-muted)", fontSize: 12, fontFamily: "var(--hp-font-mono)" }}>
            {s.label} · {s.size}
          </code>
          <div style={{ fontFamily: s.family, fontSize: s.size, fontWeight: s.weight, textWrap: "balance" }}>
            Instances reporting today
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Prose capped at 65–75ch, which is where body text stays readable. */
export const Prose: StoryObj = {
  render: () => (
    <p style={{ padding: "var(--hp-space-8)", maxWidth: "68ch", lineHeight: 1.6, textWrap: "pretty" }}>
      Benchmarks are withheld below ten instances of a similar size. A percentile
      over three instances is not an aggregate — it is individual data with a
      statistic drawn over it. The largest instances see this longest, and that
      is expected rather than a fault to be explained away.
    </p>
  ),
};
