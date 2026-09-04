import type { Meta, StoryObj } from "@storybook/react";
import { survival } from "./fixtures";

const meta: Meta = { title: "Surfaces/Survival Curve" };
export default meta;

const W = 560, H = 240, PAD = 40;
const x = (day: number) => PAD + (day / 90) * (W - PAD * 2);
const y = (alive: number) => H - PAD - alive * (H - PAD * 2);

export const NinetyDays: StoryObj = {
  render: () => {
    const line = survival.map((p) => `${x(p.day)},${y(p.alive)}`).join(" ");
    const area = `${PAD},${H - PAD} ${line} ${x(90)},${H - PAD}`;
    const at30 = survival.find((p) => p.day === 30)!;
    return (
      <div style={{ padding: "var(--hp-space-8)" }}>
        <h2 style={{ margin: 0, fontFamily: "var(--hp-font-sans)", fontSize: "var(--hp-text-xl)", fontWeight: "var(--hp-weight-semibold)" as unknown as number, lineHeight: "var(--hp-leading-snug)" }}>
          Instance survival
        </h2>
        <p style={{ color: "var(--hp-color-fg-muted)", marginTop: "var(--hp-space-2)" }}>
          Share of instances still reporting, by days since first boot.
        </p>
        <svg width={W} height={H} role="img" aria-label="Instance survival over 90 days">
          <polygon points={area} fill="var(--hp-color-chart-1)" opacity="0.14" />
          <polyline points={line} fill="none" stroke="var(--hp-color-chart-1)" strokeWidth="2" />
          {/* The 30-day figure is marked, not merely plotted. Colour is not the
              only signal: there is a rule, a dot, and a label. */}
          <line x1={x(30)} y1={PAD} x2={x(30)} y2={H - PAD} stroke="var(--hp-color-border-strong)" strokeDasharray="3 3" />
          <circle cx={x(30)} cy={y(at30.alive)} r="4" fill="var(--hp-color-chart-1)" />
          <text
            x={x(30) + 8}
            y={y(at30.alive) - 8}
            fontFamily="var(--hp-font-mono)"
            fill="var(--hp-color-fg)"
            style={{ fontSize: "var(--hp-text-sm)", fontVariantNumeric: "var(--hp-font-numeric)" as unknown as string }}
          >
            {(at30.alive * 100).toFixed(0)}% at 30d
          </text>
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--hp-color-border-strong)" />
          {[0, 30, 60, 90].map((d) => (
            <text
              key={d}
              x={x(d)}
              y={H - PAD + 16}
              textAnchor="middle"
              fontFamily="var(--hp-font-mono)"
              fill="var(--hp-color-fg-muted)"
              style={{ fontSize: "var(--hp-text-xs)", fontVariantNumeric: "var(--hp-font-numeric)" as unknown as string }}
            >
              {d}d
            </text>
          ))}
        </svg>
      </div>
    );
  },
};
