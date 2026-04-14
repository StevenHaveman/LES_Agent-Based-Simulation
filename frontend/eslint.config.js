import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
			"no-unused-vars": "error",
			"no-magic-numbers": ["warn", { "ignore": [0, 1, -1] }],
			"eqeqeq": "error",
			"no-console": ["warn", { "allow": ["warn", "error"] }],
			"no-duplicate-case": "error",
			"no-duplicate-imports": "error",
			"prefer-const": "error",
			"curly": "error",
			"no-var": "error",
			"no-else-return": "error",
			"no-unreachable": "error",
			"no-self-compare": "error",
			"no-compare-neg-zero": "error",
		},
  },
  pluginReact.configs.flat.recommended,
]);
