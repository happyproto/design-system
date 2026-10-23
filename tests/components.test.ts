import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { stripComments } from "./support/css";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

const components = stripComments(read("../src/components.css"));
const tokens = stripComments(read("../src/tokens.css"));

/** Every `--hp-*` name tokens.css declares. */
const declared = new Set(
  [...tokens.matchAll(/(--hp-[A-Za-z0-9_-]+)\s*:/g)].map((m) => m[1]),
);

/** Names components.css declares for its own use (`--hp-frame-cross`, ...). */
const local = new Set(
  [...components.matchAll(/(--hp-[A-Za-z0-9_-]+)\s*:/g)].map((m) => m[1]),
);

/**
 * The SVG tile inside the honeycomb's data URI draws in `black`, but as a
 * mask its colour is never painted, only its alpha. It is the one place a
 * colour word may appear, so it is cut out before the colour checks run.
 */
const painted = components.replace(/url\("data:image\/svg\+xml,[^"]*"\)/g, "url()");

describe("components.css", () => {
  test("names only tokens that exist, or its own locals", () => {
    const used = [...components.matchAll(/var\((--hp-[A-Za-z0-9_-]+)/g)].map(
      (m) => m[1],
    );
    expect(used.length).toBeGreaterThan(0);
    const unknown = used.filter((name) => !declared.has(name) && !local.has(name));
    expect(unknown).toEqual([]);
  });

  test("never redefines a token", () => {
    const shadowed = [...local].filter((name) => declared.has(name));
    expect(shadowed).toEqual([]);
  });

  test("writes no literal colour", () => {
    // Mask alpha is the only rgb() allowed: rgb(0 0 0 / a) in a mask is
    // opacity, not colour. Anything else is a colour that skipped the gates.
    const literals = [
      ...painted.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:oklch|oklab|hsla?|lab|lch|color)\(/g),
      ...[...painted.matchAll(/\brgba?\([^)]*\)/g)].filter(
        (m) => !/^rgba?\(0 0 0 \/ [0-9.]+\)$/.test(m[0]),
      ),
    ].map((m) => m[0]);
    expect(literals).toEqual([]);
  });

  test("uses mask alpha only inside masks", () => {
    for (const m of painted.matchAll(/rgba?\(0 0 0 \/ [0-9.]+\)/g)) {
      const line = painted.slice(painted.lastIndexOf("\n", m.index) + 1, m.index);
      expect(line).toMatch(/--hp-honeycomb-fade|mask/);
    }
  });
});
