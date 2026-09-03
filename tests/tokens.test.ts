import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { tokens } from "../src/index";
import {
  declarations,
  extractBlock,
  extractNestedBlock,
  stripComments,
} from "./support/css";

const css = readFileSync(new URL("../src/tokens.css", import.meta.url), "utf8");
const COLOUR_PREFIX = "--hp-color-";

/** Bare color names (`bg`, `chart-1`) declared in one block. */
function colorNames(block: string): string[] {
  return Object.keys(declarations(block))
    .filter((n) => n.startsWith(COLOUR_PREFIX))
    .map((n) => n.slice(COLOUR_PREFIX.length));
}

/** Bare color name -> value for one block. */
function colorValues(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(declarations(block))) {
    if (name.startsWith(COLOUR_PREFIX))
      out[name.slice(COLOUR_PREFIX.length)] = value;
  }
  return out;
}

/**
 * Every `--hp-*` custom property declared anywhere in tokens.css.
 *
 * The character class is deliberately wider than a valid token name. Matching
 * only `[a-z0-9-]` would make an invalid name *invisible* rather than
 * failing: `--hp-colorFoo` simply would not match, so the kebab-case test
 * below could never fire on the one violation its comment names, and the
 * name-parity test would not see it either.
 */
function cssNames(): Set<string> {
  return new Set(
    [...stripComments(css).matchAll(/--hp-([A-Za-z0-9_-]+)\s*:/g)].map(
      (m) => m[1],
    ),
  );
}

/** The same names, derived from the TS object: `color.bg` -> `color-bg`. */
function tsNames(): Set<string> {
  const out = new Set<string>();
  for (const [group, entries] of Object.entries(tokens)) {
    for (const key of Object.keys(entries as Record<string, string>)) {
      out.add(`${group}-${key}`);
    }
  }
  return out;
}

/**
 * The public token surface, hardcoded. This is the specification: the tests
 * iterate and index it rather than deriving a work list from the files under
 * test, so a deleted token fails on a missing key instead of quietly
 * shortening a loop. Changing it is how you change the public API.
 */
const EXPECTED_TOKENS = [
  "--hp-color-bg",
  "--hp-color-surface",
  "--hp-color-surface-raised",
  "--hp-color-border",
  "--hp-color-border-strong",
  "--hp-color-fg",
  "--hp-color-fg-muted",
  "--hp-color-accent",
  "--hp-color-accent-fg",
  "--hp-color-accent-surface",
  "--hp-color-accent-surface-fg",
  "--hp-color-accent-alt",
  "--hp-color-accent-alt-fg",
  "--hp-color-accent-alt-surface",
  "--hp-color-accent-alt-surface-fg",
  "--hp-color-success",
  "--hp-color-warning",
  "--hp-color-danger",
  "--hp-color-chart-1",
  "--hp-color-chart-2",
  "--hp-color-chart-3",
  "--hp-color-chart-4",
  "--hp-color-chart-5",
  "--hp-color-chart-6",
  "--hp-shadow-ambient",
  "--hp-shadow-overlay",
  "--hp-shadow-modal",
  "--hp-font-sans",
  "--hp-font-mono",
  "--hp-font-numeric",
  "--hp-text-xs",
  "--hp-text-sm",
  "--hp-text-base",
  "--hp-text-lg",
  "--hp-text-xl",
  "--hp-text-2xl",
  "--hp-text-3xl",
  "--hp-text-4xl",
  "--hp-text-5xl",
  "--hp-weight-regular",
  "--hp-weight-medium",
  "--hp-weight-semibold",
  "--hp-leading-tight",
  "--hp-leading-snug",
  "--hp-leading-normal",
  "--hp-leading-relaxed",
  "--hp-tracking-tight",
  "--hp-tracking-normal",
  "--hp-tracking-wide",
  "--hp-space-1",
  "--hp-space-2",
  "--hp-space-3",
  "--hp-space-4",
  "--hp-space-6",
  "--hp-space-8",
  "--hp-space-12",
  "--hp-radius-sm",
  "--hp-radius-md",
  "--hp-radius-lg",
  "--hp-z-dropdown",
  "--hp-z-sticky",
  "--hp-z-modal-backdrop",
  "--hp-z-modal",
  "--hp-z-toast",
  "--hp-z-tooltip",
  "--hp-motion-duration-fast",
  "--hp-motion-duration-base",
  "--hp-motion-ease",
];

/** The color subset of the above, as bare keys (`bg`, `chart-1`). */
const EXPECTED_COLOUR_KEYS = EXPECTED_TOKENS.filter((n) =>
  n.startsWith(COLOUR_PREFIX),
).map((n) => n.slice(COLOUR_PREFIX.length));

describe("tokens", () => {
  test("the CSS and TypeScript sources define exactly the same names", () => {
    // Two sources of one truth drift silently. This is the test that makes
    // having both of them safe.
    const inCssOnly = [...cssNames()].filter((n) => !tsNames().has(n)).sort();
    const inTsOnly = [...tsNames()].filter((n) => !cssNames().has(n)).sort();
    expect({ inCssOnly, inTsOnly }).toEqual({ inCssOnly: [], inTsOnly: [] });
  });

  test("the CSS and TypeScript sources define exactly the same color values", () => {
    // Names matching is not enough. `src/tokens.ts` is what an npm consumer
    // imports, and until this test existed nothing checked its *values* at
    // all: the contrast suite reads tokens.css exclusively, so a `fg-muted`
    // of oklch(0.85 0 0) (~1.8:1) shipped from the TS source with the whole
    // AAA suite green. `tokens.color` is the light theme, so it is compared
    // against `:root`.
    const root = colorValues(extractBlock(css, ":root"));
    const ts = tokens.color as Record<string, string>;
    // Pin BOTH sides to the hardcoded list, then iterate the hardcoded list.
    // Neither side supplies the work list, so neither can shorten it: an
    // earlier version guarded the CSS side and then looped the TS side, and
    // `color: {}` in tokens.ts iterated nothing and passed green.
    const expected = [...EXPECTED_COLOUR_KEYS].sort();
    expect(Object.keys(ts).sort(), "tokens.ts color keys").toEqual(expected);
    expect(Object.keys(root).sort(), ":root color keys").toEqual(expected);
    const mismatched: Record<string, { ts: string; css: string }> = {};
    for (const key of EXPECTED_COLOUR_KEYS) {
      if (root[key] !== ts[key]) {
        mismatched[key] = {
          ts: ts[key] ?? "(absent)",
          css: root[key] ?? "(absent)",
        };
      }
    }
    expect(mismatched).toEqual({});
  });

  test("`:root` declares exactly the expected public token surface", () => {
    // The token names are the package's public API. Without this, a token can
    // be deleted from both sources with a fully green build: `border` and
    // `border-strong` are named by no other test, and removing `border-strong`
    // gave 25 pass, 0 fail. Declining a *contrast* bar for those two was a
    // deliberate call; declining an *existence* check was not. Any deletion,
    // addition or rename now has to be made on purpose.
    const declared = Object.keys(
      declarations(extractBlock(css, ":root")),
    ).sort();
    expect(declared).toEqual([...EXPECTED_TOKENS].sort());
  });

  test("both dark-theme definitions are identical", () => {
    // The dark values are written twice: once so the theme follows the
    // system, once so an explicit data-theme can override it. Duplication is
    // the price of doing that in plain CSS with no build step — this is what
    // stops the two copies drifting, which would give a user one palette and
    // a user who had clicked the toggle a different one.
    const system = declarations(
      extractNestedBlock(css, ':root:not([data-theme="light"])'),
    );
    const explicit = declarations(extractBlock(css, '[data-theme="dark"]'));
    expect(Object.keys(system).length).toBeGreaterThan(0);
    expect(system).toEqual(explicit);
  });

  test("every token referenced by a story or preview actually exists", () => {
    // A `var(--hp-does-not-exist)` fails SILENTLY: CSS resolves it to nothing
    // and the property inherits, so the story renders with the wrong value
    // and no error anywhere. That is exactly how `--hp-font-display` survived
    // in the typography story after the token was removed. Reference
    // direction is gated here; existence is gated by EXPECTED_TOKENS above.
    const declared = cssNames();
    const dangling: string[] = [];
    for (const dir of ["../stories", "../.storybook"]) {
      const root = new URL(`${dir}/`, import.meta.url);
      for (const file of readdirSync(root, { recursive: true, encoding: "utf8" })) {
        if (!/\.(ts|tsx|mdx|css)$/.test(file)) continue;
        const body = readFileSync(new URL(file, root), "utf8");
        for (const m of body.matchAll(/var\(\s*--hp-([A-Za-z0-9_-]+)\s*[,)]/g)) {
          if (!declared.has(m[1])) dangling.push(`${dir}/${file}: --hp-${m[1]}`);
        }
      }
    }
    expect(dangling).toEqual([]);
  });

  test("every required token group is present", () => {
    for (const group of ["color", "shadow", "font", "space", "radius", "motion"]) {
      expect(Object.keys(tokens)).toContain(group);
    }
  });

  test("the dark theme overrides every color the light theme defines", () => {
    // A color defined only in :root silently keeps its light value in dark
    // mode, which is how a dark theme ends up with one unreadable element.
    //
    // Each block is located independently by its own selector, so this does
    // not depend on :root appearing before [data-theme="dark"] in the file.
    // The shared extractor throws if either selector is missing or duplicated.
    const rootColors = new Set(colorNames(extractBlock(css, ":root")));
    const darkColors = new Set(
      colorNames(extractBlock(css, '[data-theme="dark"]')),
    );
    // An empty set here means the block-extraction or the regex broke, not
    // that there is nothing to check — treat that as a hard failure rather
    // than let the assertion below pass vacuously.
    if (rootColors.size === 0) {
      throw new Error(
        ":root color block matched zero colors — check extractBlock/regex",
      );
    }
    if (darkColors.size === 0) {
      throw new Error(
        '[data-theme="dark"] color block matched zero colors — check extractBlock/regex',
      );
    }
    const missing = [...rootColors].filter((n) => !darkColors.has(n)).sort();
    expect(missing).toEqual([]);
  });

  test("token names are lowercase kebab-case", () => {
    // They are a public API; a stray camelCase name is a breaking rename later.
    //
    // This loop CANNOT iterate a hardcoded list, unlike the others. It is a
    // validator over discovered names, not a checker of required ones —
    // hardcoding the work list would mean only ever validating names already
    // known to be good, which is no test at all. A derived list is correct
    // here, so it carries the non-vacuity guard instead.
    const names = cssNames();
    expect(names.size).toBeGreaterThan(0);
    for (const name of names) {
      expect(name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});
