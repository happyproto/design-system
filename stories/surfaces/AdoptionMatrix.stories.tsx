import type { Meta, StoryObj } from "@storybook/react";
import { adoption, fleet } from "./fixtures";

const meta: Meta = { title: "Surfaces/Adoption Matrix" };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ padding: "var(--hp-space-8)", maxWidth: 720 }}>
      <h2 style={{ margin: 0, fontFamily: "var(--hp-font-sans)", fontSize: "var(--hp-text-xl)", fontWeight: "var(--hp-weight-semibold)" as unknown as number, lineHeight: "var(--hp-leading-snug)" }}>
        Feature adoption
      </h2>
      <p style={{ color: "var(--hp-color-fg-muted)", marginTop: "var(--hp-space-2)" }}>
        Across {fleet.instancesReporting} reporting instances. “Active” means used
        in the last 7 days above the subsystem’s activity floor.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "var(--hp-space-6)" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--hp-color-fg-muted)" }}>
            <th style={{ padding: "var(--hp-space-2) 0", fontWeight: "var(--hp-weight-medium)" as unknown as number }}>Subsystem</th>
            <th style={{ padding: "var(--hp-space-2) 0", fontWeight: "var(--hp-weight-medium)" as unknown as number, textAlign: "right" }}>Ever</th>
            <th style={{ padding: "var(--hp-space-2) 0", fontWeight: "var(--hp-weight-medium)" as unknown as number, textAlign: "right" }}>Active</th>
            <th style={{ padding: "var(--hp-space-2) 0 var(--hp-space-2) var(--hp-space-4)", fontWeight: "var(--hp-weight-medium)" as unknown as number }}>Share</th>
          </tr>
        </thead>
        {/* Row text sits at --hp-text-sm — the scale's own "Secondary, table
            cells" role (see Typography.stories.tsx) — rather than a
            one-off size. */}
        <tbody style={{ fontFamily: "var(--hp-font-mono)", fontSize: "var(--hp-text-sm)" }}>
          {adoption.map((row) => (
            <tr key={row.subsystem} style={{ borderTop: "1px solid var(--hp-color-border)" }}>
              <td style={{ padding: "var(--hp-space-2) 0", fontFamily: "var(--hp-font-sans)" }}>
                {row.subsystem}
              </td>
              <td style={{ padding: "var(--hp-space-2) 0", textAlign: "right", fontVariantNumeric: "var(--hp-font-numeric)" as unknown as string }}>
                {row.ever}
              </td>
              <td style={{ padding: "var(--hp-space-2) 0", textAlign: "right", fontVariantNumeric: "var(--hp-font-numeric)" as unknown as string }}>
                {row.active}
              </td>
              <td style={{ padding: "var(--hp-space-2) 0 var(--hp-space-2) var(--hp-space-4)", width: "40%" }}>
                {/* The bar is the glanceable encoding; the numbers above are the
                    precise one. Colour is never the only signal — the length
                    carries the same information. */}
                <div style={{ background: "var(--hp-color-surface-raised)", height: "var(--hp-space-2)", borderRadius: "var(--hp-radius-sm)" }}>
                  <div
                    style={{
                      width: `${(row.active / fleet.instancesReporting) * 100}%`,
                      height: "var(--hp-space-2)",
                      borderRadius: "var(--hp-radius-sm)",
                      background: "var(--hp-color-chart-1)",
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
