/**
 * Thirty days of per-collection record counts, shaped like real AppView
 * telemetry: a dominant collection, a long tail, one collection that starts
 * mid-window (a lexicon the instance began indexing), and a weekend dip.
 * Deterministic, so the chart does not reshuffle between renders.
 */
const COLLECTIONS = [
  { name: "app.bsky.feed.post", base: 42_000, growth: 1.012 },
  { name: "app.bsky.feed.like", base: 128_000, growth: 1.018 },
  { name: "app.bsky.graph.follow", base: 21_000, growth: 1.009 },
  { name: "app.bsky.feed.repost", base: 15_500, growth: 1.014 },
  { name: "app.rocksky.scrobble", base: 0, growth: 1.34, startsAt: 12 },
  { name: "app.bsky.actor.profile", base: 6_200, growth: 1.004 },
];

/** Cheap deterministic jitter — no dependency, stable across renders. */
function wobble(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43_758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

export const DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 7, 4) + i * 86_400_000);
  return d.toISOString().slice(5, 10);
});

export const SERIES = COLLECTIONS.map((c, ci) => ({
  name: c.name,
  data: DAYS.map((_, i) => {
    if (c.startsAt !== undefined && i < c.startsAt) return null;
    const n = c.startsAt === undefined ? i : i - c.startsAt;
    const weekend = [5, 6].includes((i + 2) % 7) ? 0.88 : 1;
    const seed = c.base === 0 ? 900 : c.base;
    const value =
      (c.base === 0 ? 340 : c.base) *
      c.growth ** n *
      weekend *
      (1 + wobble(seed + i * 7 + ci) * 0.05);
    return Math.round(value);
  }),
}));
