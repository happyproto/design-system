import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = { title: "Surfaces/Empty State" };
export default meta;

export const NotEnoughInstances: StoryObj = {
  render: () => (
    <div
      style={{
        padding: "var(--hp-space-12) var(--hp-space-8)",
        maxWidth: 480,
        textAlign: "center",
        margin: "0 auto",
      }}
    >
      <h2 style={{ margin: 0, fontFamily: "var(--hp-font-sans)", fontSize: "var(--hp-text-lg)", fontWeight: "var(--hp-weight-semibold)" as unknown as number, lineHeight: "var(--hp-leading-snug)" }}>
        Not enough comparable instances yet
      </h2>
      {/* Says why, and that nothing is wrong. An operator who reads this as a
          failure will go looking for a bug that does not exist. */}
      <p style={{ color: "var(--hp-color-fg-muted)", marginTop: "var(--hp-space-3)", lineHeight: "var(--hp-leading-normal)" }}>
        Benchmarks are withheld below ten instances of a similar size. A
        percentile over three instances is not an aggregate — it is individual
        data with a statistic drawn over it.
      </p>
      <p style={{ color: "var(--hp-color-fg-muted)", marginTop: "var(--hp-space-3)", lineHeight: "var(--hp-leading-normal)" }}>
        The largest instances see this longest. That is expected.
      </p>
    </div>
  ),
};
