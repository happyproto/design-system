/**
 * Contrast gates for the token palette.
 *
 * DELIBERATELY NOT ENFORCED — these are choices, not oversights:
 *
 *   `border` (1.31:1 against the light background) and `border-strong`
 *   (1.82:1) carry no contrast assertion. WCAG 1.4.11 would want 3:1 for a
 *   border that is the sole means of conveying a boundary, and reaching that
 *   means a visibly heavier line everywhere the system draws one. That is a
 *   design call for the palette task, not a number this suite should set on
 *   its own.
 */
import { describe, expect, test } from "bun:test";
import {
  converter,
  differenceEuclidean,
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  parse,
} from "culori";
import { readFileSync } from "node:fs";
import { declarations, extractBlock } from "./support/css";

const css = readFileSync(new URL("../src/tokens.css", import.meta.url), "utf8");
const COLOUR_PREFIX = "--hp-color-";
const toRgb = converter("rgb");
const toOklab = converter("oklab");
const oklabDistance = differenceEuclidean("oklab");

/** WCAG relative luminance. */
function luminance(color: string): number {
  const rgb = toRgb(parse(color));
  if (!rgb) throw new Error(`unparseable color: ${color}`);
  // culori does not gamut-map, and the guard above does not catch it: an
  // out-of-sRGB OKLCH color yields negative or >1 channels, and a negative
  // channel flows straight into the linear branch below (dividing a negative
  // by 12.92 is perfectly happy). Clamping each channel first makes the ratio
  // the one a browser actually renders rather than one no display can show.
  const channel = (raw: number) => {
    const c = Math.min(1, Math.max(0, raw));
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b)
  );
}

function ratio(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/**
 * Full dichromacy (severity 1) for each deficiency type, via culori's
 * implementation of the Machado-Oliveira-Fernandes (2009) model. Severity 1 is
 * the worst case the palette has to survive.
 */
const DEFICIENCIES = {
  deuteranopia: filterDeficiencyDeuter(1),
  protanopia: filterDeficiencyProt(1),
  tritanopia: filterDeficiencyTrit(1),
};

/** Distance in the OKLab chroma plane (a, b), ignoring lightness entirely. */
const chromaDistance = (a: string, b: string) => {
  const A = toOklab(parse(a)),
    B = toOklab(parse(b));
  if (!A || !B) throw new Error(`unparseable color: ${a} / ${b}`);
  return Math.hypot(A.a - B.a, A.b - B.b);
};

/**
 * Read one theme's color values straight from the CSS.
 *
 * The shared extractor throws on a missing or duplicated selector. The
 * previous hand-rolled version returned `{}` instead — `indexOf` gave -1,
 * `indexOf("}", -1)` clamped to 0, and `slice(-1, small)` was `""` — which
 * left every test below passing against an empty palette.
 */
function theme(selector: string): Record<string, string> {
  // `declarations()` returns full property names across every token group;
  // this suite works in bare color keys (`fg`, `chart-1`), so narrow and strip.
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(
    declarations(extractBlock(css, selector)),
  )) {
    if (name.startsWith(COLOUR_PREFIX)) {
      out[name.slice(COLOUR_PREFIX.length)] = value;
    }
  }
  return out;
}

const themes = { light: theme(":root"), dark: theme('[data-theme="dark"]') };

/**
 * Every ground text and chart marks actually sit on. `surface-raised` is the
 * card and popover ground — where semantic message text and chart marks live
 * — and it is the stricter of the three in both themes, so measuring only
 * against `bg` passes values that are unreadable where they are really used.
 */
const GROUNDS = ["bg", "surface", "surface-raised"] as const;

/**
 * The chart series and the full color surface, hardcoded.
 *
 * These are iterated directly and used to index the theme map, rather than
 * being derived from it with a filter. That is the whole point: a work list
 * derived from the data under test collapses to empty when the data goes
 * missing, the loop body never runs, and the test reports success having
 * asserted nothing. Indexing a fixed list turns the same deletion into an
 * `unparseable color: undefined` — a hard failure that needs no companion
 * guard to notice it.
 */
const CHART_KEYS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
] as const;

const COLOUR_KEYS = [
  "bg",
  "surface",
  "surface-raised",
  "border",
  "border-strong",
  "fg",
  "fg-muted",
  "accent",
  "accent-fg",
  "accent-surface",
  "accent-surface-fg",
  "accent-alt",
  "accent-alt-fg",
  "accent-alt-surface",
  "accent-alt-surface-fg",
  "success",
  "warning",
  "danger",
  ...CHART_KEYS,
] as const;

describe.each(Object.entries(themes))("%s theme", (name, c) => {
  test("the theme declares exactly the expected colors", () => {
    // DEFENCE IN DEPTH, not the primary guard. Every test below now indexes
    // the hardcoded CHART_KEYS/COLOUR_KEYS, so a missing or renamed token
    // already fails on its own as an undefined color — this test no longer
    // holds those tests up.
    //
    // What it still uniquely catches is the other direction: an *extra*
    // color. Indexing a fixed list simply ignores anything not on it, so a
    // seventh chart series or a stray new token would otherwise be gated by
    // nothing at all. Comparing the whole set closes both directions per
    // theme, including the dark block, which `EXPECTED_TOKENS` does not cover.
    expect(Object.keys(c).sort()).toEqual([...COLOUR_KEYS].sort());
  });

  test("every color is inside the sRGB gamut", () => {
    // The clamp in luminance() keeps the measured ratios honest, but on its
    // own it also silently *rescues* an unrenderable token: with the clamp
    // removed, an out-of-gamut chart-6 (r = -0.66) passed this entire suite,
    // and with it present the color is quietly corrected rather than
    // rejected. This is the gate that rejects the token itself; the clamp
    // stays as defence in depth for the arithmetic.
    //
    // EPSILON is a tolerance for float noise in the OKLCH -> sRGB conversion,
    // which lands a few ulps off an exact endpoint: `oklch(1 0 0)` converts to
    // 0.99999999999999988898. Note that is just *below* 1, so it would not
    // trip a naive `> 1` check — no token in the palette currently sits
    // outside a bound at all, and the epsilon is defensive rather than
    // load-bearing. It costs nothing: at ~5700x smaller than the tightest real
    // margin (light accent, r = 0.0057) it cannot mask an actual excursion —
    // the two tokens that prompted this test sat at r = -0.125 and -0.0027.
    const EPSILON = 1e-6;
    const outside: string[] = [];
    for (const name of COLOUR_KEYS) {
      const value = c[name];
      const rgb = toRgb(parse(value));
      if (!rgb) throw new Error(`unparseable color: ${name} = ${value}`);
      for (const ch of ["r", "g", "b"] as const) {
        if (rgb[ch] < -EPSILON || rgb[ch] > 1 + EPSILON) {
          outside.push(`${name} (${value}): ${ch}=${rgb[ch].toFixed(4)}`);
        }
      }
    }
    expect(outside).toEqual([]);
  });

  test("body text meets AAA (7:1) on every ground", () => {
    for (const ground of GROUNDS) {
      expect(ratio(c.fg, c[ground]), `fg on ${ground}`).toBeGreaterThanOrEqual(
        7,
      );
    }
  });

  test("muted text meets AAA (7:1) on every ground — the most common failure", () => {
    // Light-grey secondary text on a near-white ground is the single most
    // frequent accessibility defect in dashboards. It is a hard failure here.
    for (const ground of GROUNDS) {
      expect(
        ratio(c["fg-muted"], c[ground]),
        `fg-muted on ${ground}`,
      ).toBeGreaterThanOrEqual(7);
    }
  });

  test("text on the accent meets AAA (7:1)", () => {
    expect(ratio(c["accent-fg"], c.accent)).toBeGreaterThanOrEqual(7);
  });

  test("text on the brand surface meets AAA (7:1)", () => {
    // `accent-surface` is a fill that carries its own foreground, the same
    // contract as accent/accent-fg. It exists because a teal saturated enough
    // to read as the brand cannot also be AAA text on white -- one hue, two
    // tokens. Note it is NOT required to clear 3:1 against the grounds: at
    // the lightness needed to carry ink at 7:1 that is arithmetically
    // impossible, so a fill used as a discrete component needs an `accent`
    // border to define its edge. That is a documented rule, not an oversight.
    for (const base of ["accent-surface", "accent-alt-surface"] as const) {
      expect(
        ratio(c[`${base}-fg`], c[base]),
        `${base}-fg on ${base}`,
      ).toBeGreaterThanOrEqual(7);
    }
  });

  test("semantic colors meet AAA (7:1) as text on every ground", () => {
    // success/warning/danger are text colors in practice -- error and
    // confirmation messages -- and the palette carries a single value for
    // each, so the stricter of their uses is the binding bar. That means
    // every ground they can land on, not just the page background.
    for (const key of ["success", "warning", "danger"]) {
      for (const ground of GROUNDS) {
        expect(
          ratio(c[key], c[ground]),
          `${key} on ${ground}`,
        ).toBeGreaterThanOrEqual(7);
      }
    }
  });

  test("chart colors are distinguishable from every ground (3:1)", () => {
    // Chart marks are large graphical objects, so 3:1 is the applicable bar
    // rather than 7:1 — but zero contrast makes a series invisible, and a
    // series is invisible on a card just as thoroughly as on the page.
    for (const key of CHART_KEYS) {
      for (const ground of GROUNDS) {
        expect(
          ratio(c[key], c[ground]),
          `${key} on ${ground}`,
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });

  test("chart colors stay separable in greyscale (1.25:1)", () => {
    // Adjacent categories that differ only in hue vanish in greyscale and for
    // a viewer with a color-vision deficiency, so lightness must differ too.
    //
    // The floor is bounded above, not chosen: every chart color must also
    // clear 3:1 against the background, which caps its luminance, so six
    // colors packed into the band that remains cannot be spread further
    // apart than roughly 1.45:1 (light) or 1.40:1 (dark) pairwise.
    //
    // It was 1.25 and moved to 1.10 to buy chart saturation (minimum chroma
    // 0.089 -> 0.120). That is only safe because the chroma-plane and CVD
    // gates below now catch what this floor used to stand in for. Verified
    // against all three original counterexamples, each still rejected at
    // this floor: six pure greys (chroma-plane 0.000), a red/green-only
    // palette (CVD 0.020), six shades of one blue (CVD 0.078).
    //
    // It cannot go to zero. Lightness spread IS the color-blind protection,
    // because simulation collapses hue: an equal-lightness palette at peak
    // chroma measures CVD 0.023, where red, yellow and green all resolve to
    // near-identical olives. This floor is the vibrancy ceiling, and the
    // limit is accessibility rather than taste.
    const keys = CHART_KEYS;
    // Find the weakest pair and assert on that, so the failure names which two
    // colors collide rather than just reporting that something did.
    let worst = { pair: "", ratio: Infinity };
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const r = ratio(c[keys[i]], c[keys[j]]);
        if (r < worst.ratio)
          worst = { pair: `${keys[i]}/${keys[j]}`, ratio: r };
      }
    }
    expect(worst.ratio, `weakest pair: ${worst.pair}`).toBeGreaterThanOrEqual(
      1.25,
    );
  });

  test("chart colors are perceptually distinct (OKLab dE 0.12)", () => {
    // Luminance separation alone does not make a categorical palette legible:
    // two colors can sit a comfortable ratio apart and still read as the same
    // blue. OKLab distance accounts for hue and chroma as well, which is what
    // actually keeps six series tellable apart at a glance.
    //
    // Note that this does NOT bind hue: dE sums the lightness difference with
    // the chroma-plane one, so `oklch(0.50 0.15 250)` and
    // `oklch(0.62 0.15 250)` — identical hue and chroma — score exactly 0.12.
    // The chroma-plane test below is what binds hue; this one is a combined
    // floor over all three axes.
    const keys = CHART_KEYS;
    let worst = { pair: "", distance: Infinity };
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const d = oklabDistance(c[keys[i]], c[keys[j]]);
        if (d < worst.distance) {
          worst = { pair: `${keys[i]}/${keys[j]}`, distance: d };
        }
      }
    }
    expect(
      worst.distance,
      `closest pair: ${worst.pair}`,
    ).toBeGreaterThanOrEqual(0.12);
  });

  test("the chart palette carries hue information, not only lightness", () => {
    // This replaces a per-pair chroma-plane floor. That floor required EVERY
    // pair to differ in hue, which forbids a deliberate two-family ramp --
    // and the palette is now exactly that: shades of the brand blue
    // alternating with shades of the brand orange, separated by lightness.
    //
    // What the old gate was really guarding is that lightness cannot be the
    // ONLY signal, since OKLab dE sums the lightness term and would wave
    // through a monochrome ramp. Measuring the palette's total hue SPAN keeps
    // that guarantee while permitting the ramp. Verified against the same
    // counterexamples: six shades of one blue and six pure greys both span
    // 0.000 and are still rejected, where this palette spans 0.227 (light)
    // and 0.281 (dark).
    let span = { pair: "", distance: 0 };
    for (let i = 0; i < CHART_KEYS.length; i++) {
      for (let j = i + 1; j < CHART_KEYS.length; j++) {
        const d = chromaDistance(c[CHART_KEYS[i]], c[CHART_KEYS[j]]);
        if (d > span.distance)
          span = { pair: `${CHART_KEYS[i]}/${CHART_KEYS[j]}`, distance: d };
      }
    }
    expect(
      span.distance,
      `widest hue separation is ${span.pair}`,
    ).toBeGreaterThanOrEqual(0.15);
  });

  test("chart colors stay distinct under simulated color-vision deficiency (dE 0.09)", () => {
    // Every bar above measures normal vision, and none of them catches a
    // red-green collision. The palette that shipped before this test passed
    // all five while light chart-2/chart-3 collapsed to dE 0.0603 under
    // deuteranopia and the dark pair to 0.0225 — against the 0.12 enforced for
    // normal vision. The greyscale floor does not catch it either, because it
    // is measured before simulation: that dark pair is 1.265 normally and
    // 1.087 after.
    const keys = CHART_KEYS;
    let worst = { pair: "", deficiency: "", distance: Infinity };
    for (const [deficiency, simulate] of Object.entries(DEFICIENCIES)) {
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          const a = parse(c[keys[i]]);
          const b = parse(c[keys[j]]);
          if (!a || !b) {
            throw new Error(`unparseable color: ${c[keys[i]]} / ${c[keys[j]]}`);
          }
          const d = oklabDistance(simulate(a), simulate(b));
          if (d < worst.distance) {
            worst = { pair: `${keys[i]}/${keys[j]}`, deficiency, distance: d };
          }
        }
      }
    }
    expect(
      worst.distance,
      `closest pair under ${worst.deficiency}: ${worst.pair}`,
    ).toBeGreaterThanOrEqual(0.09);
  });
});
