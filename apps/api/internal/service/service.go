package service

import (
	"context"

	"api/internal/entities/account"
	"api/internal/entities/project"
	accountservice "api/internal/service/domain/account"
	"api/internal/service/domain/authorization"
	"api/internal/service/domain/health"
	projectservice "api/internal/service/domain/project"
	"api/internal/storage"

	"github.com/google/uuid"
)

type AccountService interface {
	Create(ctx context.Context, userId uuid.UUID) (account.Account, error)
	Delete(ctx context.Context, accountId int32) error
	GetById(ctx context.Context, accountId int32) (account.Account, error)

	GetByUserId(ctx context.Context, userId uuid.UUID) (account.Account, error)
}

type HealthService interface {
	HealthCheck(ctx context.Context) error
}

type ProjectService interface {
	Create(ctx context.Context, ownerId int32, params project.CreateProjectParams) (project.Project, error)
	Delete(ctx context.Context, id int32) error
	GetById(ctx context.Context, id int32) (project.Project, error)
	Update(ctx context.Context, id int32, params project.UpdateProjectParams) error

	GetByOwnerId(ctx context.Context, ownerId int32) ([]project.Project, error)
}

type AuthorizationService interface {
	CanCreateAccount(ctx context.Context, userId uuid.UUID) (bool, error)
	CanAccessAccount(ctx context.Context, userId uuid.UUID, account account.Account) (bool, error)

	CanCreateProject(ctx context.Context, accountId int32) (bool, error)
	CanDeleteProject(ctx context.Context, accountId int32, project project.Project) (bool, error)
	CanUpdateProject(ctx context.Context, accountId int32, project project.Project) (bool, error)
	CanAccessProject(ctx context.Context, accountId int32, project project.Project) (bool, error)
}

type Service struct {
	repositories         storage.Repository
	AccountService       AccountService
	HealthService        HealthService
	ProjectService       ProjectService
	AuthorizationService AuthorizationService
}

// NewService implementation for storage of all services.
func NewService(
	repositories storage.Repository,
) *Service {
	return &Service{
		repositories:         repositories,
		HealthService:        health.New(repositories),
		AccountService:       accountservice.New(repositories),
		ProjectService:       projectservice.New(repositories),
		AuthorizationService: authorization.New(),
	}
}

func (s *Service) Shutdown(ctx context.Context) error {
	return s.repositories.Shutdown(ctx)
}
