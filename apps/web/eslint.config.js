import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default {
	...nextJsConfig,
	rules: {
		...nextJsConfig.rules,
		"@typescript-eslint/no-explicit-any": "off",
	},
};
