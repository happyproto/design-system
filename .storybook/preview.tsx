import type { Preview } from "@storybook/react";
import "../src/tokens.css";

const preview: Preview = {
  parameters: {
    // The token background, not Storybook's default white, so contrast is
    // judged against the real ground.
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      description: "Theme",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? "light";
      document.documentElement.setAttribute("data-theme", theme);
      document.body.style.background = "var(--hp-color-bg)";
      document.body.style.color = "var(--hp-color-fg)";
      document.body.style.fontFamily = "var(--hp-font-sans)";
      return <Story />;
    },
  ],
};

export default preview;
