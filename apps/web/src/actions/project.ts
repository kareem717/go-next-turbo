"use server";

import {
	actionClientWithAccount,
	actionClientWithUser,
} from "@/lib/safe-action";
import {
	createProject,
	deleteProject,
	getAccountProjects,
	getProjectById,
	updateProject,
} from "@repo/sdk";
import { zCreateProjectParams, zUpdateProjectParams } from "@repo/sdk/zod";
import { z } from "zod";
import { pathIdSchema } from "./validations";

export const createProjectAction = actionClientWithUser
	.schema(zCreateProjectParams)
	.action(async ({ ctx: { axiosClient }, parsedInput }) => {
		const { data } = await createProject({
			client: axiosClient,
			body: parsedInput,
		});

		return data;
	});

export const updateProjectAction = actionClientWithAccount
	.schema(z.object({ id: pathIdSchema, ...zUpdateProjectParams.shape }))
	.action(async ({ ctx: { axiosClient }, parsedInput: { id, ...body } }) => {
		await updateProject({
			client: axiosClient,
			path: { id },
			body,
		});
	});

export const deleteProjectAction = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ ctx: { axiosClient }, parsedInput: id }) => {
		await deleteProject({ client: axiosClient, path: { id } });
	});

export const getProjectByIdAction = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ ctx: { axiosClient }, parsedInput: id }) => {
		const { data } = await getProjectById({
			client: axiosClient,
			path: { id },
		});

		return data;
	});

export const getAccountProjectsAction = actionClientWithAccount.action(
	async ({ ctx: { axiosClient } }) => {
		const { data } = await getAccountProjects({
			client: axiosClient,
		});

		return data;
	}
);
