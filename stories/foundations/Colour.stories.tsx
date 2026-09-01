import type { Meta, StoryObj } from "@storybook/react";
import { tokens } from "../../src/index";

const meta: Meta = { title: "Foundations/Color" };
export default meta;

const Swatch = ({ name }: { name: string }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: "var(--hp-space-3)" }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "var(--hp-radius-md)",
        background: `var(--hp-color-${name})`,
        border: "1px solid var(--hp-color-border)",
      }}
    />
    <code style={{ fontFamily: "var(--hp-font-mono)", fontSize: 13 }}>
      --hp-color-{name}
    </code>
  </div>
);

export const Palette: StoryObj = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "var(--hp-space-3)",
        padding: "var(--hp-space-6)",
      }}
    >
      {Object.keys(tokens.color).map((name) => (
        <Swatch key={name} name={name} />
      ))}
    </div>
  ),
};

export const ChartSeriesSideBySide: StoryObj = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 2,
        padding: "var(--hp-space-6)",
        height: 160,
      }}
    >
      {Object.keys(tokens.color)
        .filter((n) => n.startsWith("chart-"))
        .map((name, i) => (
          <div
            key={name}
            style={{
              flex: 1,
              background: `var(--hp-color-${name})`,
              height: `${40 + i * 18}%`,
              alignSelf: "end",
            }}
          />
        ))}
    </div>
  ),
};

/** The same bars desaturated to their greyscale luminance ramp. This is a
 *  luminance check, not a color-vision-deficiency simulation — adjacent
 *  bars that read as the same grey here have too little lightness contrast
 *  between them. Simulated CVD is enforced in the test suite, not here. */
export const ChartSeriesGreyscale: StoryObj = {
  render: () => (
    <div
      style={{
        filter: "grayscale(1)",
        display: "flex",
        gap: 2,
        padding: "var(--hp-space-6)",
        height: 160,
      }}
    >
      {Object.keys(tokens.color)
        .filter((n) => n.startsWith("chart-"))
        .map((name, i) => (
          <div
            key={name}
            style={{
              flex: 1,
              background: `var(--hp-color-${name})`,
              height: `${40 + i * 18}%`,
              alignSelf: "end",
            }}
          />
        ))}
    </div>
  ),
};
