import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Operational / migration scripts run directly with Node (CommonJS).
    "scripts/**",
    "test_firestore.js",
  ]),
  {
    rules: {
      // Performance-hint rule that over-fires on idiomatic React patterns we use
      // intentionally: client mount-guards, fetch-on-mount, and localStorage hydration.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
