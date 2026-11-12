# @happyview/design-system

Design tokens and shared components for HappyProto, gated on WCAG AAA and
colour-vision separation.

**[Browse the Storybook →](https://happyproto.github.io/design-system/)**

Tokens — colours, type, spacing, radii, shadows, motion and a semantic z-index
scale — and one stylesheet of the components happyproto.at and the dashboard
both draw: buttons, links, tags, fields, the label, the logotype, the
technical-drawing frame and the honeycomb backdrop. Plain CSS, no framework.
The stories exist to prove the language works on
real surfaces — a twelve-column matrix at AAA contrast in dark mode is where a
design language either holds or doesn't.

## Install

```bash
npm install @happyview/design-system
```

## Use

Import the stylesheet once, at the root of your app:

```ts
import "@happyview/design-system/tokens.css";
```

That defines every token as a CSS custom property. Reference them directly:

```css
.panel {
  background: var(--hp-color-surface);
  color: var(--hp-color-fg);
  border: 1px solid var(--hp-color-border);
  border-radius: var(--hp-radius-lg);
  padding: var(--hp-space-6);
  box-shadow: var(--hp-shadow-ambient);
}
```

The same values are also available to JavaScript, for tooling that needs them
without a DOM — a chart library that wants concrete colour strings, say:

```ts
import { tokens } from "@happyview/design-system";

tokens.color.accent; // "oklch(0.432 0.076 223.1)"
```

### The brand mark, the chassis and motion

- **`--hp-color-brand-mark`** is the logotype's cyan (`#2fcdfb`). It is 1.87:1
  on white, so it is for marks only: a hex glyph, a tick, a decorative
  outline, `aria-hidden` and never the only carrier of meaning. Never text,
  and never a fill that carries text. A test pins it to the logotype files.
- **The chassis.** `--hp-frame-rail` (1px) and `--hp-frame-cross` (11px) size
  the frame's rails and "+" marks. `--hp-pattern-hatch` and `--hp-pattern-hex`
  are **masks**, not paint: put a token colour on a pseudo-element and mask
  it, so the colour stays a token and follows the theme.

  ```css
  .changing::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--hp-color-border-strong);
    mask-image: var(--hp-pattern-hatch);
  }
  .field::before {
    /* … */
    mask-image: var(--hp-pattern-hex);
    mask-size: var(--hp-pattern-hex-size)
      calc(var(--hp-pattern-hex-size) * var(--hp-pattern-hex-ratio));
  }
  ```

  Never put a pattern behind text. Strips, gutters and empty fields only.
  Unprefixed `mask-image` needs Safari 15.4+, Chrome 120+ or Firefox 53+;
  below that the masked pseudo-element paints solid, so give it a
  `@supports (mask-image: none)` guard where an older browser matters.
- **Motion.** Durations `fast` (120ms, hovers), `base` (200ms, state changes),
  `slow` (400ms, reveals) and `flourish` (600ms, a one-off moment); `ease` for
  arrivals, `ease-in-out` for things that leave and return; `stagger` (40ms)
  between items revealed in sequence. **The Once Rule:** nothing animates
  forever. A decorative motion plays once per trigger, only a loading
  indicator may loop, and every transition or animation has a
  `prefers-reduced-motion: reduce` alternative.

`tokens` carries the **light** theme. `tokens.css` is the source of truth for
theming, and a test asserts every value in the JS mirror matches the `:root`
block, so the two cannot drift.

### Components

`components.css` goes after the tokens:

```ts
import "@happyview/design-system/tokens.css";
import "@happyview/design-system/components.css";
```

| Class | What it is |
| --- | --- |
| `hp-button` | Secondary button; add `hp-button-primary` (the one filled button on a screen), `hp-button-danger`, `hp-button-quiet` or `hp-button-small` |
| `hp-link` | A link in the accent, underlined |
| `hp-tag` | A chip in the mono; `data-tone` is `brand`, `alt`, `accent`, `success`, `danger` or `soon` |
| `hp-label` | A small label in the sans and the muted ink |
| `hp-field` | An input, or a box holding one with `hp-field-affix` parts beside it |
| `hp-logotype` | The logotype; pair `hp-logotype-on-light` and `hp-logotype-on-dark` and it follows the theme |
| `hp-frame` / `hp-rule` | A column with rails, and a hairline across it with a `+` at each rail; `hp-rule-bleed` runs it past the rails |
| `hp-honeycomb` | The honeycomb backdrop behind a block |
| `hp-window` | The product's panel: `hp-window-bar` holding an `hp-window-title` and `hp-window-meta`, then `hp-window-body`; `data-tone="danger"` rings it in the danger ink. Lifted in dark, as on the site |
| `hp-state` | A status in the mono after a 1em mark; `data-state` is `live`, `done`, `running`, `pending`, `failed` or `idle` |
| `hp-figure` | A measurement in the sans at medium weight, tabular; `data-size="lg"` for the one a panel is about, `hp-figure-unit` for its unit |
| `hp-term` | A terminal session: `hp-term-bar` (an `hp-term-title` and an `hp-term-copy` button), then `hp-term-body` holding `hp-term-line`s: `hp-term-cmd` (after a `$` that is never copied), `hp-term-comment`, `hp-term-out`, or a `data-state` of `done`, `warning` or `failed`; `hp-term-result` for what came back. Follows the theme |
| `hp-tree` | A project's files: `hp-tree-row`s in nested lists, `data-kind="dir"` on a folder's (a `<summary>` to open and close it), `data-type` of `script`, `config` or `data` on a file's; `hp-tree-fold`, `hp-tree-dim`, `hp-tree-note`; `aria-current` on the file the text is about |
| `hp-editor` | A file open on the page: `hp-editor-pane` with `hp-editor-tabs`, an `hp-editor-tab` (same `data-type`), `hp-editor-path` and `hp-editor-body`; an `hp-tree` before the pane puts the project beside it |
| `hp-callout` | A note set apart from the text, with `hp-callout-title`; `data-kind` is `tip`, `caution` or `danger`, or none for a note. Each kind has its own drawn mark |
| `hp-table` | A reference table in an `hp-table-scroll`: the first column fits its content, the rest share the room, and under 40rem it stacks, each cell naming its column from `data-label` |

The logotype files are exported too, so a bundler can resolve them:

```ts
import onLight from "@happyview/design-system/logotype.dark.svg";
import onDark from "@happyview/design-system/logotype.light.svg";
```

Give **both** images the name, `alt="HappyProto"`. Only one is displayed at a
time (the other is `display: none`, so out of the accessibility tree), and an
empty `alt` on either leaves the logotype, and any link around it, unnamed in
that theme.

Class names are public API on the same terms as token names (below). A test
fails the build if `components.css` writes a literal colour or names a token
that does not exist.

## Theming

Both themes are first class and independently gated. The system follows the
operating system by default; an explicit `data-theme` overrides it:

```html
<html>                      <!-- follows prefers-color-scheme -->
<html data-theme="dark">    <!-- forces dark -->
<html data-theme="light">   <!-- forces light -->
```

The dark values are written twice — once under the media query, once under the
attribute — because plain CSS with no build step has no way to share them. A
test asserts the two blocks are identical, so they cannot drift apart and hand
one palette to a system-dark user and a different one to someone who clicked a
toggle.

## Token names are a public API

Renaming a token is a **major** version. Adding one is a minor version, and
changing a *value* is a patch unless it changes meaning.

The full surface is pinned in `tests/tokens.test.ts` as an explicit list, so a
token cannot be added, removed or renamed by accident — the suite fails until
the change is made on purpose.

## What is enforced

`bun test` fails the build if any of this regresses. It is not advisory.

- Body and muted text at **7:1** against *every* ground — `bg`, `surface` and
  `surface-raised`, not just the page background. `surface-raised` is where
  card text actually lives and is the stricter ground in both themes.
- Semantic and brand colours at 7:1, each paired with a foreground solved
  alongside it.
- Chart series at **3:1** against every ground, and pairwise separated on four
  independent axes: luminance (survives greyscale), OKLab ΔE, total hue span,
  and **simulated ΔE under deuteranopia, protanopia and tritanopia**.
- Every colour inside the sRGB gamut, asserted rather than assumed — luminance
  is computed on clamped channels, so without this an unrenderable colour is
  silently rescued by the clamp and passes.
- The brand mark equals the logotype's cyan, in both themes.
- In `components.css`: no animation loops (the Once Rule), and every
  transition or animation is switched off under `prefers-reduced-motion:
  reduce`.

The colour-vision gate exists because a palette that passed every other check
still collapsed to ΔE 0.06 for a red-green colour-blind viewer. Lightness
spread turns out to *be* the protection, because simulation collapses hue —
which is also why chart vibrancy has a ceiling here, and it is an accessibility
limit rather than a matter of taste.

See [`docs/color-constraints.md`](docs/color-constraints.md) for the exact
bars, the room left inside them, and the two things arithmetic has already
settled about the palette.

## Releases

Automated with [semantic-release](https://semantic-release.gitbook.io/) on
every merge to `main`. Do not bump the version by hand and do not push tags —
semantic-release owns both, and a hand-pushed tag races it for control of the
version.

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Bump | Use for |
| --- | --- | --- |
| `fix:` | patch | a token value corrected, a gate tightened |
| `feat:` | minor | a token added — additive, so never breaking |
| `feat!:` or a `BREAKING CHANGE:` footer | major | a token **renamed or removed** |

That table is the versioning rule from above, mechanised: token names are the
public API, so renaming one is the thing that has to be a major.

Publishing authenticates by OIDC trusted publishing — there is no `NPM_TOKEN`
— which also means provenance attestations are generated automatically. The
trusted publisher on npmjs.com is registered against this repository *and this
workflow filename*, so renaming `.github/workflows/publish.yml` breaks
releases until the publisher is updated to match.

## Development

```bash
bun install
bun test          # the gates
bun run typecheck
bun run storybook # http://localhost:6006
bun run build     # emits dist/
```

## License

MIT
