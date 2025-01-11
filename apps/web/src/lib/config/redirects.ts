const dashboardRoot = "/dashboard";
const projectDashboardRoot = dashboardRoot + "/project";

// Helper function moved to top for clarity
const projectPrefix = (projectId: number, path?: string) =>
	`${projectDashboardRoot}/${projectId}${path ? `/${path}` : ""}`;

// Helper to reduce repetition in project dashboard paths
const projectPath = (projectId: number) => ({
	root: () => projectPrefix(projectId),
	path: (suffix: string) => projectPrefix(projectId, suffix),
});

export const redirects = {
	home: "/",
	legal: {
		privacy: "/privacy",
		terms: "/terms",
	},
	auth: {
		callback: "/auth/callback",
		login: "/login",
		logout: "/logout",
		afterLogout: "/login",
		afterLogin: dashboardRoot,
		otp: (email: string) => `/otp?email=${email}`,
		createAccount: "/create-account",
	},
	dashboard: {
		index: dashboardRoot,
		wallet: {
			index: "/wallet",
			positions: {
				root: "/wallet/positions",
				investments: {
					root: "/wallet/positions/investments",
					history: "/wallet/positions/investments/history",
					payments: "/wallet/positions/investments/payments",
				},
			},
		},
		createProject: dashboardRoot + "/create-project",
	},
	projectDashboard: (projectId: number) => ({
		root: projectPath(projectId).root(),
		members: projectPath(projectId).path("members"),
		settings: {
			root: projectPath(projectId).path("settings"),
			stripe: projectPath(projectId).path("settings/profile"),
		},
		stripe: {
			root: projectPath(projectId).path("stripe"),
			dashboard: projectPath(projectId).path("stripe/dashboard"),
			settings: projectPath(projectId).path("stripe/settings"),
		},
		funding: {
			index: projectPath(projectId).path("funding"),
			investments: {
				index: projectPath(projectId).path("funding/investments"),
			},
			investors: {
				index: projectPath(projectId).path("funding/investors"),
			},
			rounds: {
				root: projectPath(projectId).path("funding/rounds"),
				index: projectPath(projectId).path("funding/rounds"),
				create: projectPath(projectId).path("funding/rounds/create"),
			},
		},
	}),
};
