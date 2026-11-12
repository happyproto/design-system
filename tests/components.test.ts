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

  /**
   * A token is never redefined for the page. Inside a window it may be
   * re-pointed at a mix of other tokens: the dark window lifts its ground,
   * and the inks on it move with it so they keep 7:1 (see .hp-window). The
   * selector has to be a window's and the value has to be built from tokens.
   */
  test("re-points a token only inside a window, and only to tokens", () => {
    const misplaced: string[] = [];
    for (const rule of components.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = rule[1]!.trim();
      for (const decl of rule[2]!.matchAll(/(--hp-[A-Za-z0-9_-]+)\s*:\s*([^;]+);/g)) {
        if (!declared.has(decl[1]!)) continue;
        const inWindow = /\.hp-window\b/.test(selector);
        const fromTokens = /^(?:var\(--hp-[a-z0-9-]+\)|color-mix\(in okl(?:ch|ab), var\(--hp-[a-z0-9-]+\)(?: \d+%)?, var\(--hp-[a-z0-9-]+\)\))$/.test(decl[2]!.trim());
        // A token that names itself is a cycle: the browser drops it, and
        // everything that reads it falls back to the inherited value.
        const cycle = decl[2]!.includes(`var(${decl[1]})`);
        if (!inWindow || !fromTokens || cycle) misplaced.push(`${selector} { ${decl[1]}: ${decl[2]!.trim()} }`);
      }
    }
    expect(misplaced).toEqual([]);
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

  /**
   * The two motion tests below and the colour tests above read rules with a
   * flat regex: a selector, then a body with no braces in it. That is only
   * sound while components.css stays flat. CSS nesting would hide a rule's
   * real selector (or a whole nested rule) from them, so nesting fails here
   * first. At-rules (@media, @supports, ...) may hold rules; rules may not.
   */
  test("uses no CSS nesting, so the rule-reading tests stay sound", () => {
    const nested: string[] = [];
    const stack: string[] = [];
    let start = 0;
    for (let i = 0; i < components.length; i++) {
      const ch = components[i];
      if (ch === "{") {
        const prelude = components.slice(start, i).trim();
        const parent = stack[stack.length - 1];
        if (parent !== undefined && !parent.startsWith("@")) nested.push(`${parent} { ${prelude} }`);
        stack.push(prelude);
        start = i + 1;
      } else if (ch === "}") {
        stack.pop();
        start = i + 1;
      } else if (ch === ";") {
        start = i + 1;
      }
    }
    expect(stack).toEqual([]);
    expect(nested).toEqual([]);
    expect(/(^|[\s,{(])&/.test(components), "a nesting selector (&)").toBe(false);
  });

  /**
   * The Once Rule (tokens.css, motion): nothing in the shared components
   * animates forever, or for so many runs that it might as well. A loading
   * indicator is the only thing that may loop, and there is none here yet;
   * add its selector to LOOPS_ALLOWED on purpose if one comes.
   */
  test("loops no animation (the Once Rule)", () => {
    const LOOPS_ALLOWED: string[] = [];
    const looping: string[] = [];
    for (const rule of components.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = rule[1]!.trim();
      if (LOOPS_ALLOWED.includes(selector)) continue;
      for (const decl of rule[2]!.matchAll(/(animation(?:-iteration-count)?)\s*:\s*([^;]+)/g)) {
        // Drop function arguments (cubic-bezier(0.22, 1, ...), steps(4, end))
        // so their numbers are not read as an iteration count. What is left
        // that is a bare, unitless number is a count: durations carry a unit.
        const value = decl[2]!.replace(/\([^()]*\)/g, "()");
        const counts = [...value.matchAll(/(?<![\w.-])(\d*\.?\d+)(?![\w.%])/g)].map((m) => Number(m[1]));
        if (/\binfinite\b/.test(value) || counts.some((n) => n > 1)) {
          looping.push(`${selector} { ${decl[1]}: ${decl[2]!.trim()} }`);
        }
      }
    }
    expect(looping).toEqual([]);
  });

  test("every transition or animation stops under reduced motion", () => {
    // Every `prefers-reduced-motion: reduce` block, not just the first, and
    // the rest of the file outside them.
    const opener = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/g;
    const blocks: Array<[number, number]> = [];
    for (const m of components.matchAll(opener)) {
      let depth = 0;
      let end = m.index! + m[0].length - 1;
      for (; end < components.length; end++) {
        if (components[end] === "{") depth++;
        else if (components[end] === "}" && --depth === 0) break;
      }
      blocks.push([m.index!, end]);
    }
    expect(blocks.length, "a prefers-reduced-motion: reduce block").toBeGreaterThan(0);
    // Which property each selector has stopped: stopping a transition does
    // nothing for an animation on the same selector, and the reverse. A stop
    // is `none`, or a zero duration.
    const STOP = /\b(transition|animation)(?:\s*:\s*none\b|-duration\s*:\s*0(?:m?s)?\s*(?:[;}]|$))/g;
    const stopped = new Map<string, Set<string>>();
    let outside = "";
    let from = 0;
    for (const [start, end] of blocks) {
      outside += components.slice(from, start);
      from = end + 1;
      for (const rule of components.slice(start, end).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        for (const decl of rule[2]!.matchAll(STOP)) {
          for (const sel of rule[1]!.split(",")) {
            const name = sel.trim();
            if (!stopped.has(name)) stopped.set(name, new Set());
            stopped.get(name)!.add(decl[1]!);
          }
        }
      }
    }
    outside += components.slice(from);
    const moving: string[] = [];
    for (const rule of outside.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const props = new Set(
        [...rule[2]!.matchAll(/\b(transition|animation)(?:-[a-z-]+)?\s*:\s*(?!none\b)/g)].map((m) => m[1]!),
      );
      for (const prop of props) {
        for (const sel of rule[1]!.split(",")) {
          const name = sel.trim();
          if (!stopped.get(name)?.has(prop)) moving.push(`${name}: ${prop}`);
        }
      }
    }
    expect(stopped.size).toBeGreaterThan(0);
    expect(moving).toEqual([]);
  });

  /**
   * Labels and figures are tabular so a column of them aligns and a figure
   * that updates never jitters (DESIGN.md, the Tabular Rule). Pin it, since
   * moving them from the mono to the sans made it load-bearing: the mono
   * is tabular by construction, the sans is not.
   */
  test("sets labels and figures in tabular numbers", () => {
    for (const selector of [".hp-label", ".hp-figure"]) {
      const body = new RegExp(String.raw`(?:^|\})\s*${selector.replace(".", "\\.")}\s*\{([^{}]*)\}`).exec(components);
      expect(body, selector).not.toBeNull();
      expect(body![1], selector).toMatch(/font-variant-numeric:\s*var\(--hp-font-numeric\)/);
    }
  });

  /**
   * The brand mark is 1.87:1 on white (tokens.css): a mark, never text. These
   * are the properties that would make it text, or the caret in a field.
   */
  test("never sets text in the brand mark", () => {
    const misuse = [
      ...components.matchAll(
        /(?<![\w-])(color|-webkit-text-fill-color|caret-color)\s*:\s*[^;}]*--hp-color-brand-mark/g,
      ),
    ].map((m) => m[0]);
    expect(misuse).toEqual([]);
  });
});
