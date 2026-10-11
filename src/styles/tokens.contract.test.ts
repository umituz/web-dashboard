import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Stylesheet-token contract:
 * - every `--u-*` custom property referenced by dashboard.css must be
 *   defined in tokens.css (catches token typos and dead references),
 * - the core token families (color/radius/space/font/shadow/layout)
 *   must all be present in tokens.css.
 */

const read = (file: string): string =>
  readFileSync(join(__dirname, file), "utf8");

const tokensCss = read("tokens.css");
const dashboardCss = read("dashboard.css");

const DEFINED = new Set([...tokensCss.matchAll(/(--u-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const USED = new Set([...dashboardCss.matchAll(/var\((--u-[a-z0-9-]+)/g)].map((m) => m[1]));

describe("dashboard stylesheet token contract", () => {
  it("defines every token the stylesheet references", () => {
    const undefinedTokens = [...USED].filter((token) => !DEFINED.has(token));
    expect(undefinedTokens).toEqual([]);
  });

  it("references the token system at all", () => {
    expect(USED.size).toBeGreaterThan(40);
  });

  it("ships the core token families", () => {
    const CORE = [
      "--u-color-bg",
      "--u-color-surface",
      "--u-color-text",
      "--u-color-muted",
      "--u-color-border",
      "--u-color-border-strong",
      "--u-color-primary",
      "--u-color-primary-hover",
      "--u-color-primary-contrast",
      "--u-color-primary-soft",
      "--u-color-danger",
      "--u-color-success",
      "--u-color-warning",
      "--u-color-ring",
      "--u-radius-sm",
      "--u-radius-lg",
      "--u-radius-pill",
      "--u-space-1",
      "--u-space-8",
      "--u-font-sans",
      "--u-font-size-md",
      "--u-font-weight-bold",
      "--u-shadow-sm",
      "--u-sidebar-width",
      "--u-header-height",
    ];
    expect(CORE.filter((token) => !DEFINED.has(token))).toEqual([]);
  });

  it("provides dark-mode overrides", () => {
    expect(tokensCss).toContain('[data-udb-theme="dark"]');
  });
});
