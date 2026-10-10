import type { Meta, StoryObj } from "@storybook/react";
import { Faq, HandledList, LandingPage, SignupForm, SiteFooter, SiteHeader, UpgradeLog } from "./components";

// Every story sits on the page ground inside the container, except the full
// page, which brings its own.
const meta: Meta = {
  title: "Marketing/Landing",
  decorators: [
    (Story, context) =>
      context.parameters.fullPage ? (
        <Story />
      ) : (
        <div className="mk-page">
          <div className="mk-container" style={{ paddingBlock: "var(--hp-space-8)" }}>
            <Story />
          </div>
        </div>
      ),
  ],
};
export default meta;

export const SignupIdle: StoryObj = { name: "Signup — idle", render: () => <SignupForm id="idle" /> };
export const SignupSubmitting: StoryObj = {
  name: "Signup — submitting",
  render: () => <SignupForm id="submitting" state="submitting" />,
};
export const SignupSuccess: StoryObj = {
  name: "Signup — success",
  render: () => <SignupForm id="success" state="success" email="ada@example.com" />,
};
export const SignupSuccessLong: StoryObj = {
  name: "Signup — success, long address",
  render: () => (
    <SignupForm id="success-long" state="success" email={"ada.lovelace.analytical.engine." + "notes".repeat(12) + "@example.com"} />
  ),
};
export const SignupInvalid: StoryObj = {
  name: "Signup — invalid",
  render: () => <SignupForm id="invalid" state="invalid" />,
};
export const SignupUnavailable: StoryObj = {
  name: "Signup — unavailable",
  render: () => <SignupForm id="unavailable" state="unavailable" />,
};

export const Handled: StoryObj = { name: "What's handled", render: () => <HandledList /> };
export const Questions: StoryObj = { name: "FAQ", render: () => <Faq /> };

export const Log: StoryObj = { name: "Upgrade log", render: () => <UpgradeLog /> };
export const Header: StoryObj = { name: "Site header", render: () => <SiteHeader /> };
export const Footer: StoryObj = { name: "Site footer", render: () => <SiteFooter /> };

/** `fullPage` makes the meta decorator step aside: this story is the whole page. */
export const FullPage: StoryObj = {
  name: "Landing page",
  parameters: { layout: "fullscreen", fullPage: true },
  render: () => <LandingPage />,
};
