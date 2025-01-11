package authorization

import (
	"api/internal/entities/project"
	"context"
)

func (s *AuthorizationService) CanCreateProject(ctx context.Context, accountId int32) (bool, error) {
	return true, nil
}

func (s *AuthorizationService) CanDeleteProject(ctx context.Context, accountId int32, project project.Project) (bool, error) {
	return project.OwnerId == accountId, nil
}

func (s *AuthorizationService) CanUpdateProject(ctx context.Context, accountId int32, project project.Project) (bool, error) {
	return project.OwnerId == accountId, nil
}

func (s *AuthorizationService) CanAccessProject(ctx context.Context, accountId int32, project project.Project) (bool, error) {
	return project.OwnerId == accountId, nil
}
