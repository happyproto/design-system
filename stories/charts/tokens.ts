/**
 * Read live token values off the document.
 *
 * ECharts needs concrete colour strings, not `var()` references, so the
 * bridge has to resolve them at render time. Reading from computed style
 * (rather than importing the TS mirror) means the chart follows the active
 * theme — including a system-driven one, where no data-theme attribute
 * exists to inspect.
 */
export function token(name: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--hp-${name}`)
    .trim();
  if (!value) throw new Error(`token --hp-${name} is not defined`);
  return value;
}

export const chartSeries = (): string[] =>
  [1, 2, 3, 4, 5, 6].map((n) => token(`color-chart-${n}`));

