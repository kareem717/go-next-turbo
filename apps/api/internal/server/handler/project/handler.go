package project

import (
	"context"
	"database/sql"
	"errors"

	"api/internal/entities/project"
	"api/internal/server/handler/shared"
	"api/internal/server/utils"
	"api/internal/service"

	"github.com/danielgtaylor/huma/v2"
	"go.uber.org/zap"
)

type projectHandler struct {
	service *service.Service
	logger  *zap.Logger
}

func newProjectHandler(service *service.Service, logger *zap.Logger) *projectHandler {
	if service == nil {
		panic("service is nil")
	}

	if logger == nil {
		panic("logger is nil")
	}

	return &projectHandler{
		service: service,
		logger:  logger,
	}
}

type singleProjectResponse struct {
	Body project.Project
}

type createProjectRequest struct {
	Body project.CreateProjectParams
}

func (h *projectHandler) create(ctx context.Context, input *createProjectRequest) (*singleProjectResponse, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	canCreate, err := h.service.AuthorizationService.CanCreateProject(ctx, account.ID)
	if err != nil {
		h.logger.Error("failed to check if account can create project", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if account can create project")
	}

	if !canCreate {
		return nil, huma.Error403Forbidden("You are not authorized to create a project")
	}

	project, err := h.service.ProjectService.Create(ctx, account.ID, input.Body)
	if err != nil {
		h.logger.Error("failed to create project", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the project")
	}

	resp := &singleProjectResponse{}
	resp.Body = project

	return resp, nil
}

func (h *projectHandler) getById(ctx context.Context, input *shared.IdPathParam) (*singleProjectResponse, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	project, err := h.service.ProjectService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Project not found")
		default:
			h.logger.Error("failed to fetch project", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the project")
		}
	}

	canAccess, err := h.service.AuthorizationService.CanAccessProject(ctx, account.ID, project)
	if err != nil {
		h.logger.Error("failed to check if account can access project", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if account can access project")
	}

	if !canAccess {
		return nil, huma.Error403Forbidden("You are not authorized to access this project")
	}

	resp := &singleProjectResponse{}
	resp.Body = project

	return resp, nil
}

type multipleProjectResponse struct {
	Body []project.Project
}

func (h *projectHandler) getByOwnerId(ctx context.Context, input *struct{}) (*multipleProjectResponse, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	projects, err := h.service.ProjectService.GetByOwnerId(ctx, account.ID)
	if err != nil {
		h.logger.Error("failed to fetch projects", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the projects")
	}

	resp := &multipleProjectResponse{}
	resp.Body = projects

	return resp, nil
}

type updateProjectRequest struct {
	shared.IdPathParam
	Body project.UpdateProjectParams
}

func (h *projectHandler) update(ctx context.Context, input *updateProjectRequest) (*struct{}, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	project, err := h.service.ProjectService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Project not found")
		default:
			h.logger.Error("failed to fetch project", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the project")
		}
	}

	canUpdate, err := h.service.AuthorizationService.CanUpdateProject(ctx, account.ID, project)
	if err != nil {
		h.logger.Error("failed to check if account can update project", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if account can update project")
	}

	if !canUpdate {
		return nil, huma.Error403Forbidden("You are not authorized to update this project")
	}

	err = h.service.ProjectService.Update(ctx, input.ID, input.Body)
	if err != nil {
		h.logger.Error("failed to update project", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the project")
	}

	return &struct{}{}, nil
}

func (h *projectHandler) delete(ctx context.Context, input *shared.IdPathParam) (*struct{}, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	project, err := h.service.ProjectService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Project not found")
		default:
			h.logger.Error("failed to fetch project", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the project")
		}
	}

	canDelete, err := h.service.AuthorizationService.CanDeleteProject(ctx, account.ID, project)
	if err != nil {
		h.logger.Error("failed to check if account can delete project", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if account can delete project")
	}

	if !canDelete {
		return nil, huma.Error403Forbidden("You are not authorized to delete this project")
	}

	err = h.service.ProjectService.Delete(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to delete project", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the project")
	}

	return &struct{}{}, nil
}
