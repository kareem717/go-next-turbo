import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { redirects } from "@/lib/config/redirects";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/"],
				disallow: [
					`${redirects.auth.callback}`,
					`${redirects.auth.logout}`,
					`${redirects.auth.createAccount}`,
				],
			},
		],
		sitemap: `${env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
	};
}
