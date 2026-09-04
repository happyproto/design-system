# @happyview/design-system

Design tokens for HappyProto, gated on WCAG AAA and colour-vision separation.

**[Browse the Storybook →](https://happyproto.github.io/design-system/)**

Tokens only: colours, type, spacing, radii, shadows, motion and a semantic
z-index scale. No components. The stories exist to prove the language works on
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

`tokens` carries the **light** theme. `tokens.css` is the source of truth for
theming, and a test asserts every value in the JS mirror matches the `:root`
block, so the two cannot drift.

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

The colour-vision gate exists because a palette that passed every other check
still collapsed to ΔE 0.06 for a red-green colour-blind viewer. Lightness
spread turns out to *be* the protection, because simulation collapses hue —
which is also why chart vibrancy has a ceiling here, and it is an accessibility
limit rather than a matter of taste.

See [`docs/colour-constraints.md`](docs/colour-constraints.md) for the exact
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
