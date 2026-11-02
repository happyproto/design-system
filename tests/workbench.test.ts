/**
 * Contrast gates for the workbench pieces in components.css: the terminal,
 * the file tree, the editor and callouts.
 *
 * The palette's own suite (contrast.test.ts) measures each ink on the three
 * grounds. These pieces put inks where that suite does not look: the accent
 * and the orange as text on a terminal, and inks on two tinted grounds that
 * are mixes rather than tokens. Each case below is a pairing the CSS really
 * draws, in both themes, and the tints are read from components.css, so a
 * stronger tint there fails here.
 */
import { describe, expect, test } from "bun:test";
import { converter, interpolate, parse } from "culori";
import { readFileSync } from "node:fs";
import { declarations, extractBlock, stripComments } from "./support/css";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const tokens = read("../src/tokens.css");
const components = stripComments(read("../src/components.css"));
const toRgb = converter("rgb");

function luminance(color: string | object): number {
  const rgb = toRgb(typeof color === "string" ? parse(color) : (color as never));
  if (!rgb) throw new Error(`unparseable color: ${String(color)}`);
  const channel = (raw: number) => {
    const c = Math.min(1, Math.max(0, raw));
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

function ratio(a: string | object, b: string | object): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
}

/** CSS `color-mix(in oklab, ink pct%, ground)`. */
const mix = (ink: string, pct: number, ground: string) =>
  interpolate([ground, ink], "oklab")(pct / 100);

function theme(selector: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(declarations(extractBlock(tokens, selector)))) {
    if (name.startsWith("--hp-color-")) out[name.slice("--hp-color-".length)] = value;
  }
  return out;
}

const themes = { light: theme(":root"), dark: theme('[data-theme="dark"]') };

/** The percentage a tint rule mixes, read from the stylesheet. */
function tint(selector: string, ink: string, ground: string): number {
  const re = new RegExp(
    String.raw`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\s*\{[^}]*color-mix\(in oklab, var\(${ink}\) (\d+)%, var\(${ground}\)\)`,
  );
  const m = components.match(re);
  if (!m) throw new Error(`no ${ink} tint found in ${selector}`);
  return Number(m[1]);
}

const AAA = 7;
const MARK = 3; // a drawn mark is a graphical object, WCAG 1.4.11

describe.each(Object.entries(themes))("%s theme", (_, c) => {
  const at = (inks: string[], ground: string, floor: number, label = ground) => {
    for (const ink of inks) {
      expect(ratio(c[ink]!, c[ground] ?? ground), `${ink} on ${label}`).toBeGreaterThanOrEqual(floor);
    }
  };

  test("the terminal's inks meet AAA on its body, bar and result", () => {
    // Body (surface): commands, flags, strings, output, comments and the
    // state lines. Bar (surface-raised): the title and the copy button.
    // Result (bg): what came back, with links.
    at(["fg", "fg-muted", "accent", "accent-alt", "success", "warning", "danger"], "surface", AAA);
    at(["fg", "fg-muted"], "surface-raised", AAA);
    at(["fg", "fg-muted", "accent"], "bg", AAA);
  });

  test("the tree's and editor's marks are visible on their grounds", () => {
    at(["fg-muted", "accent", "accent-alt", "success"], "surface", MARK);
    at(["fg-muted", "accent", "accent-alt", "success"], "bg", MARK);
  });

  test("the current tree row keeps its inks at AAA, and its marks visible", () => {
    const pct = tint(".hp-tree-row[aria-current]", "--hp-color-accent", "--hp-color-surface");
    const ground = mix(c.accent!, pct, c.surface!);
    for (const ink of ["fg", "fg-muted"]) {
      expect(ratio(c[ink]!, ground), `${ink} on the current row`).toBeGreaterThanOrEqual(AAA);
    }
    for (const ink of ["accent", "accent-alt", "success"]) {
      expect(ratio(c[ink]!, ground), `${ink} mark on the current row`).toBeGreaterThanOrEqual(MARK);
    }
  });

  test.each(["accent", "success", "warning", "danger"])(
    "a callout tinted toward %s keeps every ink on it at AAA",
    (kind) => {
      const pct = tint(".hp-callout", "--hp-callout-ink", "--hp-color-bg");
      const ground = mix(c[kind]!, pct, c.bg!);
      // The body, a muted aside, the title in the kind's ink, and a link.
      for (const ink of ["fg", "fg-muted", kind, "accent"]) {
        expect(ratio(c[ink]!, ground), `${ink} on a ${kind} callout`).toBeGreaterThanOrEqual(AAA);
      }
    },
  );
});

test("each callout kind names an ink the suite above measures", () => {
  const inks = [...components.matchAll(/\.hp-callout\[data-kind="[a-z]+"\]\s*\{[^}]*--hp-callout-ink:\s*var\(--hp-color-([a-z-]+)\)/g)].map(
    (m) => m[1],
  );
  expect(inks.sort()).toEqual(["danger", "success", "warning"]);
  expect(components).toMatch(/\.hp-callout\s*\{[^}]*--hp-callout-ink:\s*var\(--hp-color-accent\)/);
});
