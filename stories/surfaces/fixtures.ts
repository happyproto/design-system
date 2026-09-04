/**
 * Synthetic fixtures. Storybook is deployed publicly, so nothing here may
 * resemble real fleet data. Deterministic on purpose: stories that change
 * between runs cannot be reviewed by comparison.
 */
export const fleet = {
  instancesReporting: 47,
  medianRecords: 184_000,
  medianDatabaseBytes: 2_310_000_000,
  survivalAt30Days: 0.78,
};

/** Database size distribution, as histogram buckets. */
export const sizeDistribution = [
  { bucket: "1e3", count: 2 },
  { bucket: "1e4", count: 9 },
  { bucket: "1e5", count: 21 },
  { bucket: "1e6", count: 12 },
  { bucket: "1e7", count: 3 },
];

/** Per-subsystem adoption: ever switched on, and load-bearing in the last 7 days. */
export const adoption = [
  { subsystem: "lexicons", ever: 47, active: 47 },
  { subsystem: "backfill", ever: 44, active: 31 },
  { subsystem: "jetstream", ever: 47, active: 46 },
  { subsystem: "scripts", ever: 19, active: 6 },
  { subsystem: "plugins", ever: 7, active: 1 },
  { subsystem: "labeler", ever: 11, active: 4 },
  { subsystem: "spaces", ever: 23, active: 14 },
  { subsystem: "linked repos", ever: 9, active: 3 },
  { subsystem: "xrpc proxy", ever: 41, active: 38 },
  { subsystem: "jobs", ever: 47, active: 45 },
  { subsystem: "dpop clients", ever: 30, active: 22 },
  { subsystem: "api keys", ever: 35, active: 27 },
];

/** Fraction of instances still reporting N days after first boot. */
export const survival = [
  { day: 0, alive: 1.0 }, { day: 15, alive: 0.91 }, { day: 30, alive: 0.78 },
  { day: 45, alive: 0.71 }, { day: 60, alive: 0.66 }, { day: 75, alive: 0.62 },
  { day: 90, alive: 0.59 },
];
