const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Strip CSS comments, so nothing inside one can be mistaken for real syntax. */
export function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/**
 * Return the body of the single TOP-LEVEL rule whose selector is `selector`.
 *
 * Only top-level occurrences count, so the same selector nested inside an
 * at-rule -- `@media (prefers-contrast: more) { :root { ... } }` -- is a
 * legal override rather than a duplicate that halts the suite.
 *
 * Throws when the selector is absent or appears more than once at top level.
 * That is deliberate: a block finder that quietly returns an empty string is
 * how a test comes to assert nothing at all while still reporting green.
 */
export function extractBlock(css: string, selector: string): string {
  const clean = stripComments(css);
  const re = new RegExp(String.raw`(?:^|[}\s;])${escapeRegExp(selector)}\s*\{`, "g");
  const opens: number[] = [];
  for (const m of clean.matchAll(re)) {
    const brace = m.index! + m[0].length - 1;
    // Count only matches that sit at nesting depth 0.
    let depth = 0;
    for (let i = 0; i < brace; i++) {
      if (clean[i] === "{") depth++;
      else if (clean[i] === "}") depth--;
    }
    if (depth === 0) opens.push(brace);
  }
  if (opens.length !== 1) {
    throw new Error(`expected exactly one top-level \`${selector}\` rule, found ${opens.length}`);
  }
  let depth = 0;
  for (let i = opens[0]; i < clean.length; i++) {
    if (clean[i] === "{") depth++;
    else if (clean[i] === "}" && --depth === 0) return clean.slice(opens[0] + 1, i);
  }
  throw new Error(`unbalanced braces in \`${selector}\``);
}

/** The `--hp-color-*` name -> value pairs declared in one block. */
export function declarations(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  // `[^;}\n]+` so a declaration missing its semicolon cannot swallow the next.
  for (const m of block.matchAll(/(--hp-[A-Za-z0-9_-]+)\s*:\s*([^;}\n]+)/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}
