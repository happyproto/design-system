import type { Meta, StoryObj } from "@storybook/react";
import "../../src/components.css";
import onLight from "../../src/assets/logotype.dark.svg";
import onDark from "../../src/assets/logotype.light.svg";

const meta: Meta = { title: "Components/Shared" };
export default meta;

const row = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--hp-space-3)" } as const;
const stack = { display: "grid", gap: "var(--hp-space-6)", padding: "var(--hp-space-8)" } as const;

export const Buttons: StoryObj = {
  render: () => (
    <div style={stack}>
      <div style={row}>
        <button className="hp-button hp-button-primary" type="button">Create project</button>
        <button className="hp-button" type="button">Cancel</button>
        <button className="hp-button hp-button-danger" type="button">Delete project</button>
        <button className="hp-button hp-button-quiet" type="button">Retry</button>
        <button className="hp-button" type="button" disabled>Disabled</button>
      </div>
      <div style={row}>
        <button className="hp-button hp-button-small" type="button">Small</button>
        <a className="hp-button hp-button-primary" href="#new">A link as a button</a>
        <a className="hp-link" href="#docs">A link in the accent</a>
      </div>
    </div>
  ),
};

export const Tags: StoryObj = {
  render: () => (
    <div style={{ ...stack, ...row }}>
      <span className="hp-tag">public</span>
      <span className="hp-tag" data-tone="brand">record</span>
      <span className="hp-tag" data-tone="alt">query</span>
      <span className="hp-tag" data-tone="accent">running</span>
      <span className="hp-tag" data-tone="success">done</span>
      <span className="hp-tag" data-tone="danger">failed</span>
      <span className="hp-tag" data-tone="soon">soon</span>
    </div>
  ),
};

export const Fields: StoryObj = {
  render: () => (
    <div style={{ ...stack, maxInlineSize: "28rem" }}>
      <p className="hp-label">Lexicons · 3</p>
      <input className="hp-field" placeholder="Search projects" aria-label="Search projects" />
      <label className="hp-field">
        <span className="hp-field-affix" aria-hidden="true">@</span>
        <input placeholder="alice.bsky.social" aria-label="Handle" />
      </label>
      <label className="hp-field">
        <span className="hp-field-affix" aria-hidden="true">https://</span>
        <input defaultValue="tidepool" aria-label="Name" aria-invalid="true" />
        <span className="hp-field-affix" aria-hidden="true">.happyview.dev</span>
      </label>
    </div>
  ),
};

export const Logotype: StoryObj = {
  render: () => (
    <div style={stack}>
      <span>
        <img className="hp-logotype hp-logotype-on-light" src={onLight} alt="HappyProto" />
        <img className="hp-logotype hp-logotype-on-dark" src={onDark} alt="" />
      </span>
    </div>
  ),
};

export const Frame: StoryObj = {
  render: () => (
    <div style={{ overflowX: "clip", paddingBlock: "var(--hp-space-12)" }}>
      <div
        className="hp-frame hp-honeycomb"
        style={{ maxInlineSize: "40rem", marginInline: "auto", ["--hp-honeycomb-heart" as string]: "50% 0%" }}
      >
        <div style={{ padding: "var(--hp-space-12) var(--hp-space-6)" }}>
          <p className="hp-label">Overview</p>
          <h2 style={{ margin: "var(--hp-space-2) 0 0", fontSize: "var(--hp-text-xl)" }}>Rails, rules and marks</h2>
        </div>
        <section className="hp-rule hp-rule-bleed" style={{ padding: "var(--hp-space-6)" }}>
          A rule across the frame, run past the rails.
        </section>
        <section className="hp-rule" style={{ padding: "var(--hp-space-6)" }}>
          A rule that stops at the rails.
        </section>
        <div className="hp-rule hp-rule-bleed" data-edge="end" style={{ padding: "var(--hp-space-6)" }}>
          A rule on the bottom edge.
        </div>
      </div>
    </div>
  ),
};
