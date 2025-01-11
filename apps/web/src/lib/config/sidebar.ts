import { ElementType } from "react";
import { redirects } from "./redirects";
import { LayoutGrid, Plus } from "lucide-react";

export type NavigationItem =
	| {
			title: string;
			url: string;
			icon?: ElementType;
	  }
	| {
			title: string;
			root: string;
			icon?: ElementType;
			items: {
				title: string;
				url: string;
			}[];
	  };

export type NavigationMenu = {
	name: string;
	path: string;
	items: NavigationItem[];
};

/**
 * An array of navigation items for the project dashboard sidebar.
 */
const projectDashboard = (projectId: number): NavigationMenu[] => [
	{
		name: "Project",
		path: redirects.dashboard.index,
		items: [
			{
				title: "Overview",
				url: redirects.projectDashboard(projectId).root,
				icon: LayoutGrid,
			},
		],
	},
];

/**
 * An array of navigation items for the root dashboard sidebar.
 */
const dashboard: NavigationMenu[] = [
	{
		name: "Projects",
		path: redirects.dashboard.index,
		items: [
			{
				title: "Overview",
				url: redirects.dashboard.index,
				icon: LayoutGrid,
			},
			{
				title: "Create",
				url: redirects.dashboard.createProject,
				icon: Plus,
			},
		],
	},
];

/**
 * A configuration object for the root dashboard sidebar navigation items.
 */
export const sidebar = {
	projectDashboard,
	dashboard,
};
