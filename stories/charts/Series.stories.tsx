import type { Meta, StoryObj } from "@storybook/react";
import { Chart } from "./Chart";

const meta: Meta = { title: "Charts/Series" };
export default meta;

const Frame = ({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
}) => (
  <section style={{ padding: "var(--hp-space-6)", display: "grid", gap: "var(--hp-space-3)" }}>
    <h2
      style={{
        margin: 0,
        fontSize: "var(--hp-text-lg)",
        fontWeight: "var(--hp-weight-semibold)" as unknown as number,
        color: "var(--hp-color-fg)",
      }}
    >
      {label}
    </h2>
    <p
      style={{
        margin: 0,
        maxWidth: "70ch",
        fontSize: "var(--hp-text-sm)",
        lineHeight: "var(--hp-leading-normal)",
        color: "var(--hp-color-fg-muted)",
      }}
    >
      {note}
    </p>
    {children}
  </section>
);

export const Lines: StoryObj = {
  render: () => (
    <Frame
      label="Records indexed per day"
      note="Six series is the palette's worst case — the number it was solved for. One collection starts mid-window, which is what a newly indexed lexicon looks like."
    >
      <Chart palette="tokens" />
    </Frame>
  ),
};

export const StackedArea: StoryObj = {
  render: () => (
    <Frame
      label="Stacked area"
      note="The harshest test of a categorical palette: large flat fills meeting at hard edges, where any two colors that are close will read as one band."
    >
      <Chart palette="tokens" kind="area" />
    </Frame>
  ),
};

export const Bars: StoryObj = {
  render: () => (
    <Frame
      label="Bars"
      note="Small adjacent marks, where hue does the work and lightness separation is what survives at this size."
    >
      <Chart palette="tokens" kind="bar" />
    </Frame>
  ),
};
