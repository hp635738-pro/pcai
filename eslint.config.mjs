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
  ]),
  // Vendored components: copied verbatim from their upstream sources
  // (shadcn/ui, vercel/ai-elements, 21st.dev). Keep them exactly as shipped
  // instead of linting/rewriting someone else's code.
  {
    files: [
      "components/ui/**/*.tsx",
      "components/ai-elements/**/*.tsx",
      "components/blocks/**/*.tsx",
      "hooks/use-mobile.ts",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;
