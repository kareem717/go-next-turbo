import { redirects } from "@/lib/config/redirects";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export const updateSession = async (request: NextRequest) => {
	// This `try/catch` block is only here for the interactive tutorial.
	// Feel free to remove once you have Supabase connected.
	try {
		// Create an unmodified response
		let response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});

		const supabase = createServerClient(
			env.NEXT_PUBLIC_SUPABASE_URL,
			env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			{
				cookies: {
					getAll() {
						return request.cookies.getAll();
					},
					setAll(cookiesToSet: any) {
						cookiesToSet.forEach(({ name, value }: any) =>
							request.cookies.set(name, value)
						);
						response = NextResponse.next({
							request,
						});
						cookiesToSet.forEach(({ name, value, options }: any) =>
							response.cookies.set(name, value, options)
						);
					},
				},
			}
		);

		// This will refresh session if expired - required for Server Components
		// https://supabase.com/docs/guides/auth/server-side/nextjs
		const user = await supabase.auth.getUser();

		// protected routes
		if (
			request.nextUrl.pathname.includes(redirects.dashboard.index) &&
			user.error
		) {
			return NextResponse.redirect(new URL(redirects.auth.login, request.url));
		}

		if (request.nextUrl.pathname === "/" && !user.error) {
			return NextResponse.redirect(
				new URL(redirects.dashboard.index, request.url)
			);
		}

		return response;
	} catch {
		// If you are here, a Supabase client could not be created!
		// This is likely because you have not set up environment variables.
		// Check out http://localhost:3000 for Next Steps.
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
	}
};
