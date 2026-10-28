// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const entry = readFileSync(new URL("./dashboard.css", import.meta.url), "utf8");
const css = readFileSync(new URL("./chrome.css", import.meta.url), "utf8");
const chartsCss = readFileSync(new URL("../domains/charts/charts.css", import.meta.url), "utf8");
const sheet = css + chartsCss;

const defined = new Set([...sheet.matchAll(/(--udb-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const used = new Set([...sheet.matchAll(/var\((--udb-[a-z0-9-]+)\)/g)].map((m) => m[1]));

describe("dashboard stylesheet contract", () => {
  it("defines every --udb variable it uses", () => {
    expect([...used].filter((v) => !defined.has(v))).toEqual([]);
  });

  it("defines the eight chart series tokens", () => {
    for (let i = 1; i <= 8; i += 1) {
      expect(chartsCss).toContain(`--udb-chart-${i}:`);
    }
  });

  it("entry chains the design-system stylesheet, the chrome rules and the chart rules", () => {
    expect(entry).toContain('@import "@umituz/web-design-system/styles.css";');
    expect(entry).toContain('@import "./chrome.css";');
    expect(entry).toContain('@import "../domains/charts/charts.css";');
  });

  it("chrome carries no stylesheet imports (Tailwind hosts import it beside their own DS build)", () => {
    expect(css.match(/@import[^;]+;/g) ?? []).toEqual([]);
  });

  it("chart selectors live in charts.css, not chrome.css", () => {
    expect(
      css.match(/udb-(chartcard|chartlegend|charttip|barchart|donut|linechart|hbars|heatmap)[a-z_-]*/g) ?? [],
    ).toEqual([]);
  });

  it("carries no legacy --u-* tokens", () => {
    expect(sheet.match(/--u-[a-z0-9-]+/g) ?? []).toEqual([]);
  });

  it("reads only design-system variables that exist or are documented optional slots", () => {
    const optional = new Set([
      "--color-primary-hover",
      "--color-primary-soft",
      "--color-destructive-hover",
      "--color-destructive-soft",
      "--color-success-soft",
      "--color-warning-soft",
    ]);
    const dsCss = readFileSync(
      new URL("../../node_modules/@umituz/web-design-system/dist/styles.css", import.meta.url),
      "utf8",
    );
    const dsDefined = new Set([...dsCss.matchAll(/(--[a-z][a-z0-9-]*)\s*:/g)].map((m) => m[1]));
    const read = new Set([...sheet.matchAll(/var\((--[a-z][a-z0-9-]*)[,)]/g)].map((m) => m[1]));
    const missing = [...read].filter(
      (v) => !v.startsWith("--udb-") && !dsDefined.has(v) && !optional.has(v),
    );
    expect(missing).toEqual([]);
  });
});
