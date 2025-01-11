// This file is auto-generated by @hey-api/openapi-ts

import {
  createClient,
  createConfig,
  type Options,
} from "@hey-api/client-axios";
import type {
  DeleteAccountData,
  DeleteAccountResponse,
  DeleteAccountError,
  GetAccountData,
  GetAccountResponse,
  GetAccountError,
  CreateAccountData,
  CreateAccountResponse,
  CreateAccountError,
  HealthCheckData,
  HealthCheckResponse,
  HealthCheckError,
  GetProjectsByOwnerIdData,
  GetProjectsByOwnerIdResponse,
  GetProjectsByOwnerIdError,
  CreateProjectData,
  CreateProjectResponse,
  CreateProjectError,
  DeleteProjectData,
  DeleteProjectResponse,
  DeleteProjectError,
  GetProjectByIdData,
  GetProjectByIdResponse,
  GetProjectByIdError,
  UpdateProjectData,
  UpdateProjectResponse,
  UpdateProjectError,
} from "./types.gen";

export const client = createClient(createConfig());

/**
 * Delete your account
 * Deletes the account for the currently authenticated user.
 */
export const deleteAccount = <ThrowOnError extends boolean = false>(
  options?: Options<DeleteAccountData, ThrowOnError>,
) => {
  return (options?.client ?? client).delete<
    DeleteAccountResponse,
    DeleteAccountError,
    ThrowOnError
  >({
    ...options,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/account",
  });
};

/**
 * Get your account
 * Fetches the account for the currently authenticated user.
 */
export const getAccount = <ThrowOnError extends boolean = false>(
  options?: Options<GetAccountData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetAccountResponse,
    GetAccountError,
    ThrowOnError
  >({
    ...options,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/account",
  });
};

/**
 * Create an account
 * Creates an account for the currently authenticated user.
 */
export const createAccount = <ThrowOnError extends boolean = false>(
  options?: Options<CreateAccountData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    CreateAccountResponse,
    CreateAccountError,
    ThrowOnError
  >({
    ...options,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/account",
  });
};

/**
 * Health check
 * Health check.
 */
export const healthCheck = <ThrowOnError extends boolean = false>(
  options?: Options<HealthCheckData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    HealthCheckResponse,
    HealthCheckError,
    ThrowOnError
  >({
    ...options,
    url: "/health",
  });
};

/**
 * Get a project by owner id
 * Fetches all projects owned by the currently authenticated account.
 */
export const getProjectsByOwnerId = <ThrowOnError extends boolean = false>(
  options?: Options<GetProjectsByOwnerIdData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetProjectsByOwnerIdResponse,
    GetProjectsByOwnerIdError,
    ThrowOnError
  >({
    ...options,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/project",
  });
};

/**
 * Create a project
 * Creates a project for the currently authenticated account.
 */
export const createProject = <ThrowOnError extends boolean = false>(
  options?: Options<CreateProjectData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    CreateProjectResponse,
    CreateProjectError,
    ThrowOnError
  >({
    ...options,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/project",
  });
};

/**
 * Delete a project
 * Deletes a project by its id.
 */
export const deleteProject = <ThrowOnError extends boolean = false>(
  options?: Options<DeleteProjectData, ThrowOnError>,
) => {
  return (options?.client ?? client).delete<
    DeleteProjectResponse,
    DeleteProjectError,
    ThrowOnError
  >({
    ...options,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/project/{id}",
  });
};

/**
 * Get a project by id
 * Fetches a project by its id.
 */
export const getProjectById = <ThrowOnError extends boolean = false>(
  options?: Options<GetProjectByIdData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetProjectByIdResponse,
    GetProjectByIdError,
    ThrowOnError
  >({
    ...options,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/project/{id}",
  });
};

/**
 * Update a project
 * Updates a project using its id as an identifier.
 */
export const updateProject = <ThrowOnError extends boolean = false>(
  options?: Options<UpdateProjectData, ThrowOnError>,
) => {
  return (options?.client ?? client).put<
    UpdateProjectResponse,
    UpdateProjectError,
    ThrowOnError
  >({
    ...options,
    security: [
      {
        scheme: "bearer",
        type: "http",
      },
    ],
    url: "/project/{id}",
  });
};
