# Color constraints

Every color in `src/tokens.css` is gated by `tests/contrast.test.ts`. This
document states what those gates are, what room is left inside them, and the
two facts that are already settled by arithmetic rather than taste.

The current values are **provisional**. They exist to keep the gates honest,
not because anyone designed them. Replacing them is the point of the design
work. The constraints below are what a replacement has to satisfy.

To check a candidate palette: edit `src/tokens.css` and run `bun test`. A
failure names the token, the ground, and the bar it missed.

## The six gates

Measured with `culori`, per theme, against **all three grounds** (`bg`,
`surface`, `surface-raised`) — not just `bg`. `surface-raised` is the card and
popover ground, and it is the stricter one in both themes.

| #   | Gate                                    | Applies to                                                                               |
| --- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | **7:1** against every ground            | `fg`, `fg-muted`, `accent`, `success`, `warning`, `danger` (and `accent-fg` on `accent`) |
| 2   | **3:1** against every ground            | the six chart colors                                                                     |
| 3   | **1.25:1** pairwise luminance           | chart colors, so they survive greyscale                                                  |
| 4   | **0.12** OKLab ΔE pairwise              | chart colors, perceptual separation                                                      |
| 5   | **0.08** chroma-plane distance pairwise | chart colors — `hypot(Δa, Δb)`, which lightness cannot pay for                           |
| 6   | **0.09** simulated ΔE pairwise          | chart colors, under deuteranopia, protanopia AND tritanopia                              |

Gate 6 is the one that matters most and is easiest to miss. It was added after
a palette that passed all of gates 1–5 turned out to collapse to ΔE 0.0603
under deuteranopia — two of its series were indistinguishable to a red-green
color-blind viewer while every other gate reported green. Gates 3 and 4
cannot see this, because they measure the colors as a normal-sighted viewer
receives them.

Every color must also be **inside the sRGB gamut**. This is enforced
separately, because luminance is computed on clamped channels: without the
assertion, an unrenderable color is silently rescued by the clamp and passes.

## How much room is left

The tightest margins in the current palette, all verified:

| Constraint                | Bar  | Current worst | Headroom |
| ------------------------- | ---- | ------------- | -------- |
| pairwise luminance        | 1.25 | 1.2609        | 0.9%     |
| simulated ΔE              | 0.09 | 0.1196        | 33%      |
| chroma-plane              | 0.08 | 0.0932        | 16%      |
| chart vs `surface-raised` | 3.0  | 3.093         | 3.1%     |
| OKLab ΔE                  | 0.12 | 0.151         | 26%      |

Pairwise luminance is nearly at its floor, and that floor is itself close to a
hard ceiling: because every chart color must also clear 3:1 against the
strictest ground, six colors cannot be spread more than about **1.45:1**
apart pairwise in the light theme, or **1.40:1** in the dark. There is no
version of this palette where the six series are widely separated in
lightness. Adding a seventh gate, or raising an existing one, needs a re-solve
rather than a nudge.

## Two things already settled

**White text on a mid-blue accent cannot reach AAA.** At hue 250 and chroma
0.15, an accent carrying white text has to sit at L ≤ 0.46. A mid-tone accent
measures 4.85:1 against a required 7:1.

**A saturated yellow cannot be AAA text on white.** Reaching 7:1 at hue 75
forced chroma down from 0.13 to 0.095 — a muted olive rather than a yellow.

Both are the same shape, and two of six semantic colors hit it. If the design
wants a vivid warning or a bright accent, the answer is not a different value
but a different structure: split the token into a text color and a surface
color, the way `accent` and `accent-fg` already are. A `warning` dark enough
to read as text plus a `warning-surface` bright enough to look like a warning.

## Deliberately not enforced

`border` (1.31:1) and `border-strong` (1.82:1) are unenforced. WCAG 1.4.11
wants 3:1 where a border is the sole means of conveying a boundary, and
reaching that means a visibly heavier line. That is a design decision, not a
number to set from a test file — but it IS a decision, so make it knowingly.

## A note on the AA/AAA difference

General frontend guidance, including the `impeccable` skill's, targets WCAG AA
— 4.5:1 for body text, 3:1 for large. This system targets **AAA at 7:1**. The
stricter bar wins here; a palette designed to 4.5:1 will fail on arrival.
