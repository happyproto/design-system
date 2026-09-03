import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { DAYS, SERIES } from "./data";
import { chartSeries, token } from "./tokens";

type Props = {
  /** Kept explicit so a future palette trial has an obvious seam to use. */
  palette: "tokens";
  kind?: "line" | "area" | "bar";
  height?: number;
};

/**
 * Every colour here is read from a token at render time; not one is written
 * literally. Axis lines, labels, tooltip and grid all use the neutral ramp,
 * so the chart is the design system rather than an island with its own
 * styling — and a palette change lands here with no edit to this file.
 */
export function Chart({ palette, kind = "line", height = 340 }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    const chart = echarts.init(host.current, undefined, { renderer: "svg" });

    const paint = () => {
      const colors = chartSeries();
      const fg = token("color-fg");
      const muted = token("color-fg-muted");
      const border = token("color-border");
      const surface = token("color-surface");

      chart.setOption(
        {
          color: colors,
          animationDuration: 260,
          textStyle: { fontFamily: token("font-sans"), fontSize: 12 },
          grid: { top: 16, right: 16, bottom: 24, left: 56 },
          tooltip: {
            trigger: "axis",
            backgroundColor: surface,
            borderColor: border,
            textStyle: { color: fg },
            valueFormatter: (v: number) =>
              v == null ? "—" : v.toLocaleString("en-US"),
          },
          legend: {
            type: "scroll",
            bottom: 0,
            icon: "roundRect",
            itemWidth: 10,
            itemHeight: 10,
            textStyle: { color: muted, fontSize: 11 },
          },
          xAxis: {
            type: "category",
            data: DAYS,
            boundaryGap: kind === "bar",
            axisLine: { lineStyle: { color: border } },
            axisTick: { show: false },
            axisLabel: { color: muted, fontSize: 11, interval: 4 },
          },
          yAxis: {
            type: "value",
            splitLine: { lineStyle: { color: border } },
            axisLabel: {
              color: muted,
              fontSize: 11,
              formatter: (v: number) =>
                v >= 1000 ? `${Math.round(v / 1000)}k` : String(v),
            },
          },
          series: SERIES.map((s, i) => ({
            name: s.name,
            type: kind === "bar" ? "bar" : "line",
            stack: kind === "area" ? "total" : undefined,
            areaStyle: kind === "area" ? { opacity: 0.85 } : undefined,
            smooth: false,
            showSymbol: false,
            lineStyle: kind === "line" ? { width: 2 } : undefined,
            connectNulls: false,
            data: s.data,
            emphasis: { focus: "series" },
            z: SERIES.length - i,
          })),
        },
        { notMerge: true },
      );
    };

    paint();
    // Repaint when the theme flips, from the toolbar or from the OS.
    const observer = new MutationObserver(paint);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", paint);
    const resize = () => chart.resize();
    window.addEventListener("resize", resize);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", paint);
      window.removeEventListener("resize", resize);
      chart.dispose();
    };
  }, [palette, kind]);

  return <div ref={host} style={{ width: "100%", height }} role="img"
    aria-label="Records indexed per day, by collection, over the last 30 days" />;
}
