import type { Meta, StoryObj } from "@storybook/react";
import { sizeDistribution } from "./fixtures";

const meta: Meta = { title: "Surfaces/Distribution" };
export default meta;

const W = 560, H = 220, PAD = 32;

export const DatabaseSize: StoryObj = {
  render: () => {
    const max = Math.max(...sizeDistribution.map((d) => d.count));
    const bw = (W - PAD * 2) / sizeDistribution.length;
    return (
      <div style={{ padding: "var(--hp-space-8)" }}>
        <h2 style={{ margin: 0, fontFamily: "var(--hp-font-sans)", fontSize: "var(--hp-text-xl)", fontWeight: "var(--hp-weight-semibold)" as unknown as number, lineHeight: "var(--hp-leading-snug)" }}>
          Database size
        </h2>
        <p style={{ color: "var(--hp-color-fg-muted)", marginTop: "var(--hp-space-2)" }}>
          Instances per order of magnitude of record count.
        </p>
        <svg width={W} height={H} role="img" aria-label="Distribution of instance sizes">
          {sizeDistribution.map((d, i) => {
            const h = (d.count / max) * (H - PAD * 2);
            return (
              <g key={d.bucket}>
                <rect
                  x={PAD + i * bw + 4}
                  y={H - PAD - h}
                  width={bw - 8}
                  height={h}
                  fill="var(--hp-color-chart-1)"
                  rx="2"
                />
                <text
                  x={PAD + i * bw + bw / 2}
                  y={H - PAD + 16}
                  textAnchor="middle"
                  fontFamily="var(--hp-font-mono)"
                  fill="var(--hp-color-fg-muted)"
                  style={{ fontSize: "var(--hp-text-xs)", fontVariantNumeric: "var(--hp-font-numeric)" as unknown as string }}
                >
                  {d.bucket}
                </text>
                <text
                  x={PAD + i * bw + bw / 2}
                  y={H - PAD - h - 6}
                  textAnchor="middle"
                  fontFamily="var(--hp-font-mono)"
                  fill="var(--hp-color-fg)"
                  style={{ fontSize: "var(--hp-text-xs)", fontVariantNumeric: "var(--hp-font-numeric)" as unknown as string }}
                >
                  {d.count}
                </text>
              </g>
            );
          })}
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--hp-color-border-strong)" />
        </svg>
      </div>
    );
  },
};
