import type { Meta, StoryObj } from "@storybook/react";
import { fleet } from "./fixtures";

const meta: Meta = { title: "Surfaces/Stat Tiles" };
export default meta;

const TILES = [
  { label: "Instances reporting", value: fleet.instancesReporting.toString(), unit: "" },
  { label: "Median records", value: (fleet.medianRecords / 1000).toFixed(0), unit: "k" },
  { label: "Median database", value: (fleet.medianDatabaseBytes / 1e9).toFixed(1), unit: "GB" },
  { label: "Alive at 30 days", value: (fleet.survivalAt30Days * 100).toFixed(0), unit: "%" },
];

export const Row: StoryObj = {
  render: () => (
    <div
      style={{
        padding: "var(--hp-space-8)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "var(--hp-space-4)",
      }}
    >
      {TILES.map((t) => (
        <div
          key={t.label}
          style={{
            background: "var(--hp-color-surface)",
            border: "1px solid var(--hp-color-border)",
            borderRadius: "var(--hp-radius-md)",
            padding: "var(--hp-space-4)",
          }}
        >
          <div style={{ color: "var(--hp-color-fg-muted)", fontSize: "var(--hp-text-sm)" }}>{t.label}</div>
          {/* Mono for the figure so digits align across tiles and between
              refreshes; a proportional face makes numbers jitter as they
              change. font-variant-numeric keeps digits tabular on top of that. */}
          <div
            style={{
              fontFamily: "var(--hp-font-mono)",
              // 2xl, not 3xl. 3xl is section-heading scale and tips a stat
              // tile toward the hero-metric block PRODUCT.md rejects by name.
              // 2xl sits one step above the panel heading, which reads as a
              // figure without shouting.
              fontSize: "var(--hp-text-2xl)",
              fontVariantNumeric: "var(--hp-font-numeric)" as unknown as string,
              marginTop: "var(--hp-space-2)",
            }}
          >
            {t.value}
            <span style={{ fontSize: "var(--hp-text-base)", color: "var(--hp-color-fg-muted)" }}>{t.unit}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
