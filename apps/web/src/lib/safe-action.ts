import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { zodAdapter } from "next-safe-action/adapters/zod";
import { env } from "@/lib/env";
import { createClient as createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { zErrorModel } from "@repo/sdk/zod";
import { createClient } from "@hey-api/client-axios";
import { getAccount } from "@repo/sdk";

export const actionClient = createSafeActionClient({
	validationAdapter: zodAdapter(),
	handleServerError: async (error) => {
		const parsedError = zErrorModel.safeParse(error);

		if (!parsedError.success) {
			return {
				message: DEFAULT_SERVER_ERROR_MESSAGE,
				statusCode: 500,
			};
		}

		return {
			message: parsedError.data.detail,
			statusCode: parsedError.data.status,
		};
	},
}).use(async ({ next }) =>
	next({
		ctx: {
			axiosClient: createClient({
				baseURL: env.NEXT_PUBLIC_BACKEND_API_URL,
			}),
		},
	})
);

export const actionClientWithUser = actionClient.use(async ({ next, ctx }) => {
	const sb = await createSupabaseServerClient();

	const {
		data: { session },
		error: sessionError,
	} = await sb.auth.getSession();

	if (sessionError) {
		throw new Error("Error getting user session");
	}

	if (!session) {
		throw new Error("User session empty");
	}

	console.debug("session access token", session.access_token);

	ctx.axiosClient.setConfig({
		headers: {
			Authorization: `Bearer ${session.access_token}`,
		},
	});

	const { data, error } = await sb.auth.getUser();

	if (error) {
		throw new Error("Error getting user");
	}

	if (!data?.user) {
		throw new Error("User data empty");
	}

	return next({
		ctx: {
			...ctx,
			user: data.user,
		},
	});
});

export const actionClientWithAccount = actionClientWithUser.use(
	async ({ next, ctx }) => {
		let account;
		if (ctx.user?.id) {
			const { data, error } = await getAccount({
				client: ctx.axiosClient,
			});

			if (error) {
				if (error.status !== 404) {
					console.error("Error getting account by user id: ", error);
				}
			}

			account = data?.account;
		}

		return next({
			ctx: {
				...ctx,
				account,
			},
		});
	}
);
