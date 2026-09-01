import type { Meta, StoryObj } from "@storybook/react";
import { tokens } from "../../src/index";

const meta: Meta = { title: "Foundations/Spacing" };
export default meta;

export const Space: StoryObj = {
  render: () => (
    <div style={{ padding: "var(--hp-space-8)", display: "grid", gap: "var(--hp-space-3)" }}>
      {Object.keys(tokens.space).map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: "var(--hp-space-3)" }}>
          <code style={{ width: 120, fontFamily: "var(--hp-font-mono)", fontSize: 12 }}>
            --hp-space-{k}
          </code>
          <div style={{ width: `var(--hp-space-${k})`, height: 20, background: "var(--hp-color-accent)" }} />
        </div>
      ))}
    </div>
  ),
};

export const Radius: StoryObj = {
  render: () => (
    <div style={{ padding: "var(--hp-space-8)", display: "flex", gap: "var(--hp-space-4)" }}>
      {Object.keys(tokens.radius).map((k) => (
        <div key={k} style={{ textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: "var(--hp-color-surface-raised)",
              border: "1px solid var(--hp-color-border)",
              borderRadius: `var(--hp-radius-${k})`,
            }}
          />
          <code style={{ fontFamily: "var(--hp-font-mono)", fontSize: 12 }}>{k}</code>
        </div>
      ))}
    </div>
  ),
};
