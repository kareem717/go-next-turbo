import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
	},
	client: {
		NEXT_PUBLIC_APP_URL: z.string().url().min(1),
		NEXT_PUBLIC_SUPABASE_URL: z.string().url().min(1),
		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
		NEXT_PUBLIC_BACKEND_API_URL: z.string().url().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
	},
});
