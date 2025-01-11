// This file is auto-generated by @hey-api/openapi-ts

import { z } from "zod";

export const zAccount = z.object({
  created_at: z.string().datetime(),
  id: z.number().int().gte(1),
  updated_at: z.union([z.string().datetime(), z.null()]),
  user_id: z.string(),
});

export const zErrorDetail = z.object({
  location: z.string().optional(),
  message: z.string().optional(),
  value: z.unknown().optional(),
});

export const zErrorModel = z.object({
  $schema: z.string().url().readonly().optional(),
  detail: z.string().optional(),
  errors: z.union([z.array(zErrorDetail), z.null()]).optional(),
  instance: z.string().url().optional(),
  status: z.bigint().optional(),
  title: z.string().optional(),
  type: z.string().url().optional().default("about:blank"),
});

export const zHealthCheckOutputBody = z.object({
  $schema: z.string().url().readonly().optional(),
  message: z.string(),
});

export const zMultipleProjectResponseBody = z.object({
  $schema: z.string().url().readonly().optional(),
  projects: z.union([
    z.array(
      z.object({
        created_at: z.string().datetime(),
        id: z.number().int().gte(1),
        name: z.string().min(1).max(60),
        owner_id: z.number().int(),
        updated_at: z.union([z.string().datetime(), z.null()]),
      }),
    ),
    z.null(),
  ]),
});

export const zProject = z.object({
  created_at: z.string().datetime(),
  id: z.number().int().gte(1),
  name: z.string().min(1).max(60),
  owner_id: z.number().int(),
  updated_at: z.union([z.string().datetime(), z.null()]),
});

export const zSingleAccountResponseBody = z.object({
  $schema: z.string().url().readonly().optional(),
  account: zAccount,
});

export const zSingleProjectResponseBody = z.object({
  $schema: z.string().url().readonly().optional(),
  project: zProject,
});

export const zDeleteAccountResponse = z.void();

export const zGetAccountResponse = zSingleAccountResponseBody;

export const zCreateAccountResponse = zSingleAccountResponseBody;

export const zHealthCheckResponse = zHealthCheckOutputBody;

export const zGetProjectsByOwnerIdResponse = zMultipleProjectResponseBody;

export const zCreateProjectResponse = zSingleProjectResponseBody;

export const zDeleteProjectResponse = z.void();

export const zGetProjectByIdResponse = zSingleProjectResponseBody;

export const zUpdateProjectResponse = z.void();
