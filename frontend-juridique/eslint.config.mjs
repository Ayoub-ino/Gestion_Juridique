import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The app loads data on mount through effects (async fetch helpers
      // defined in the component body, plus localStorage hydration). The
      // React 19 `set-state-in-effect` rule (enabled by default in the Next
      // preset) conservatively flags every setState reachable from an effect,
      // including legitimate async fetch-on-mount helpers. Keep it as a
      // warning instead of an error: it still surfaces genuine synchronous
      // setState-in-effect regressions without failing the build.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
