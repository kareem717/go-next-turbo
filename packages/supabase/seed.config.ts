import { SeedPg } from "@snaplet/seed/adapter-pg";
import { defineConfig } from "@snaplet/seed/config";
import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
	adapter: async () => {
		const client = new Client(process.env.DB_URL);
		await client.connect();
		return new SeedPg(client);
	},
	select: [
		// We don't alter any extensions tables that might be owned by extensions
		"!*",
		// We want to alter all the tables under public schema
		"public.*",
		// We also want to alter some of the tables under the auth schema
		"auth.users",
	],
});
