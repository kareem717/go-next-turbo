import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

export default defineConfig({
	client: "@hey-api/client-axios",
	experimentalParser: true,
	input: {
		path: "../../apps/api/openapi.yaml",
		include: "^(?!.*webhook).*$",
	},
	output: {
		format: "prettier",
		lint: "eslint",
		path: "./src",
	},
	plugins: [...defaultPlugins, "zod"],
});
