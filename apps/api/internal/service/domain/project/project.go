package project

import (
	"context"

	"api/internal/entities/project"
	"api/internal/storage"
)

type ProjectService struct {
	repositories storage.Repository
}

func New(repositories storage.Repository) *ProjectService {
	return &ProjectService{
		repositories: repositories,
	}
}

func (s *ProjectService) GetById(ctx context.Context, id int32) (project.Project, error) {
	return s.repositories.Project().GetById(ctx, id)
}

func (s *ProjectService) Create(ctx context.Context, ownerId int32, params project.CreateProjectParams) (project.Project, error) {
	return s.repositories.Project().Create(ctx, ownerId, params)
}

func (s *ProjectService) Delete(ctx context.Context, id int32) error {
	return s.repositories.Project().Delete(ctx, id)
}

func (s *ProjectService) Update(ctx context.Context, id int32, params project.UpdateProjectParams) error {
	return s.repositories.Project().Update(ctx, id, params)
}

func (s *ProjectService) GetByOwnerId(ctx context.Context, ownerId int32) ([]project.Project, error) {
	return s.repositories.Project().GetByOwnerId(ctx, ownerId)
}
