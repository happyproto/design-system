import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { hero } from "./content";
import {
  CompareTable,
  Credentials,
  Faq,
  Feature,
  HeroPill,
  HeroSub,
  LandingPage,
  NetworkPanel,
  NoscriptNote,
  PluginsPanel,
  SignupForm,
  SiteFooter,
  SiteHeader,
  Stage,
  UpgradesPanel,
} from "./components";

// Every story sits on the page ground inside the container, except the full
// page and the feature sections, which bring their own; a panel gets the
// width of a feature section's panel column.
const meta: Meta = {
  title: "Marketing/Landing",
  decorators: [
    (Story, context) =>
      context.parameters.fullPage ? (
        <Story />
      ) : (
        <div className="mk-page">
          <div
            className="mk-container"
            style={{
              paddingBlock: "var(--hp-space-8)",
              maxInlineSize: context.parameters.column ? "40rem" : undefined,
            }}
          >
            <Story />
          </div>
        </div>
      ),
  ],
};
export default meta;

/** A story form sits in the closing form's wrapper, as on the page. */
function InForm({ children }: { children: ReactNode }) {
  return <div className="mk-cta-signup">{children}</div>;
}

export const HeroCopy: StoryObj = {
  name: "Hero — the pill, the H1 (display size) and the sub",
  render: () => (
    <div className="mk-hero-copy">
      <HeroPill />
      <h1 className="mk-title">{hero.title}</h1>
      <HeroSub />
    </div>
  ),
};

/**
 * Settled: as the page looks without JavaScript, with reduced motion, in
 * print, or once it has played. Pending: under .js-motion, before it comes
 * into view, every step sits 8px low in the muted ink (full opacity, 7:1),
 * the emoji in grey; play.ts lands each step 60ms after the one before.
 */
export const ProductStage: StoryObj = {
  name: "Hero — the product stage (a sample HappyView instance), settled",
  render: () => <Stage />,
};
export const ProductStagePending: StoryObj = {
  name: "Hero — the product stage, before it plays",
  render: () => (
    <div className="js-motion">
      <Stage />
    </div>
  ),
};
export const PanelNetwork: StoryObj = { name: "Panel — Jetstream and a backfill job, settled", parameters: { column: true }, render: () => <NetworkPanel /> };
export const PanelNetworkPending: StoryObj = {
  name: "Panel — Jetstream and a backfill job, before it plays",
  parameters: { column: true },
  render: () => (
    <div className="js-motion">
      <NetworkPanel />
    </div>
  ),
};
export const PanelPlugins: StoryObj = { name: "Panel — a Lua script and a WASM plugin", parameters: { column: true }, render: () => <PluginsPanel /> };
export const PanelUpgrades: StoryObj = { name: "Panel — an upgrade: snapshot taken, install or hold", parameters: { column: true }, render: () => <UpgradesPanel /> };
export const FeatureSections: StoryObj = {
  name: "Sections — one point each (headline, line, panel)",
  parameters: { layout: "fullscreen", fullPage: true },
  render: () => (
    <div className="mk-page">
      <Feature which="network" />
      <Feature which="plugins" flip />
      <Feature which="upgrades" />
    </div>
  ),
};

export const SignupIdle: StoryObj = { name: "Signup — idle, closing (its own helper)", render: () => <InForm><SignupForm id="idle" /></InForm> };
export const SignupHeroIdle: StoryObj = {
  name: "Signup — idle, hero (no helper: the status line is empty at rest)",
  render: () => (
    <div className="mk-hero-signup">
      <SignupForm id="hero-idle" hero />
    </div>
  ),
};
/** Without JavaScript the form is hidden; the note says why. */
export const SignupNoscript: StoryObj = {
  name: "Signup — without JavaScript (the note)",
  render: () => <NoscriptNote />,
};
export const SignupSubmitting: StoryObj = {
  name: "Signup — submitting",
  render: () => <InForm><SignupForm id="submitting" state="submitting" /></InForm>,
};
export const SignupSuccess: StoryObj = {
  name: "Signup — success: the heading, then the follow-up note",
  render: () => <InForm><SignupForm id="success" state="success" email="ada@example.com" /></InForm>,
};
export const SignupNoteSending: StoryObj = {
  name: "Signup — success, note sending",
  render: () => <InForm><SignupForm id="note-sending" state="success" note="sending" /></InForm>,
};
export const SignupNoteSent: StoryObj = {
  name: "Signup — success, note sent: the note as a quote, then the thanks",
  render: () => <InForm><SignupForm id="note-sent" state="success" note="sent" /></InForm>,
};
export const SignupNoteUnavailable: StoryObj = {
  name: "Signup — success, note didn’t save",
  render: () => <InForm><SignupForm id="note-unavailable" state="success" note="unavailable" /></InForm>,
};
export const SignupSuccessLong: StoryObj = {
  name: "Signup — success, long address",
  render: () => (
    <InForm>
      <SignupForm id="success-long" state="success" email={"ada.lovelace.analytical.engine." + "notes".repeat(12) + "@example.com"} />
    </InForm>
  ),
};
export const SignupInvalid: StoryObj = {
  name: "Signup — typo",
  render: () => <InForm><SignupForm id="invalid" state="invalid" /></InForm>,
};
export const SignupDomain: StoryObj = {
  name: "Signup — part after the @",
  render: () => <InForm><SignupForm id="domain" state="invalid" invalid="domain" /></InForm>,
};
export const SignupNoAt: StoryObj = {
  name: "Signup — no @",
  render: () => <InForm><SignupForm id="no-at" state="invalid" invalid="noAt" /></InForm>,
};
export const SignupEmpty: StoryObj = {
  name: "Signup — empty",
  render: () => <InForm><SignupForm id="empty" state="invalid" invalid="empty" /></InForm>,
};
export const SignupRejected: StoryObj = {
  name: "Signup — the server turned the address down",
  render: () => <InForm><SignupForm id="rejected" state="invalid" invalid="rejected" /></InForm>,
};
export const SignupUnavailable: StoryObj = {
  name: "Signup — unavailable",
  render: () => <InForm><SignupForm id="unavailable" state="unavailable" /></InForm>,
};

export const CredentialLine: StoryObj = { name: "Credential line", render: () => <Credentials /> };

/**
 * Settled: as the page looks without JavaScript, with reduced motion, in
 * print, or once a row has arrived. Pending: under .js-motion, a row not yet
 * in view sits 8px low in the muted ink (full opacity, 7:1) with its ticks
 * small and muted; reveal.ts settles each one as it enters the viewport.
 */
export const Compare: StoryObj = {
  name: "What HappyProto runs for you — settled",
  render: () => <CompareTable />,
};
export const ComparePending: StoryObj = {
  name: "What HappyProto runs for you — rows still to arrive",
  render: () => (
    <div className="js-motion">
      <CompareTable />
    </div>
  ),
};
export const Questions: StoryObj = { name: "FAQ — settled", render: () => <Faq /> };
export const QuestionsPending: StoryObj = {
  name: "FAQ — items still to arrive",
  render: () => (
    <div className="js-motion">
      <Faq />
    </div>
  ),
};

export const Header: StoryObj = { name: "Site header", render: () => <SiteHeader /> };
export const Footer: StoryObj = { name: "Site footer", render: () => <SiteFooter /> };

/** `fullPage` makes the meta decorator step aside: this story is the whole page. */
export const FullPage: StoryObj = {
  name: "Landing page",
  parameters: { layout: "fullscreen", fullPage: true },
  render: () => <LandingPage />,
};
