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
        <img className="hp-logotype hp-logotype-on-dark" src={onDark} alt="HappyProto" />
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

const marks = {
  live: <circle cx="8" cy="8" r="3.5" fill="currentColor" />,
  done: <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />,
  running: (
    <>
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.75a3.25 3.25 0 0 1 0 6.5z" fill="currentColor" />
    </>
  ),
  pending: <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />,
  failed: <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />,
  idle: <path d="M4 8h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />,
};

const State = ({ state, children }: { state: keyof typeof marks; children: string }) => (
  <span className="hp-state" data-state={state}>
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">{marks[state]}</svg>
    {children}
  </span>
);

export const States: StoryObj = {
  render: () => (
    <div style={{ ...stack, ...row }}>
      <State state="live">running</State>
      <State state="done">completed</State>
      <State state="running">migrating</State>
      <State state="pending">queued</State>
      <State state="failed">failed</State>
      <State state="idle">stopped</State>
    </div>
  ),
};

export const Window: StoryObj = {
  render: () => (
    <div style={{ ...stack, maxInlineSize: "36rem" }}>
      <section className="hp-window">
        <header className="hp-window-bar">
          <h2 className="hp-window-title">Health</h2>
          <span className="hp-window-meta"><State state="live">responding</State></span>
        </header>
        <div className="hp-window-body" style={{ display: "flex", gap: "var(--hp-space-8)" }}>
          <div>
            <p className="hp-label">Response time</p>
            <p className="hp-figure" data-size="lg">84<span className="hp-figure-unit">ms</span></p>
          </div>
          <div>
            <p className="hp-label">Records</p>
            <p className="hp-figure">48,213,906</p>
          </div>
        </div>
      </section>
      <section className="hp-window" data-tone="danger">
        <header className="hp-window-bar">
          <h2 className="hp-window-title">Danger zone</h2>
        </header>
        <div className="hp-window-body">
          <button className="hp-button hp-button-danger" type="button">Delete project</button>
        </div>
      </section>
    </div>
  ),
};
