import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "dom",
          environment: "jsdom",
          setupFiles: ["./src/domains/onboarding/test/setup.ts"],
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["src/styles/dashboard.contract.test.ts"],
        },
      },
      {
        test: {
          name: "node",
          environment: "node",
          include: ["src/styles/dashboard.contract.test.ts"],
        },
      },
    ],
  },
});
