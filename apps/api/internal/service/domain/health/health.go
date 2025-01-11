package health

import (
	"context"
	"time"

	"api/internal/storage"
)

type HealthService struct {
	repositories storage.Repository
}

func New(repositories storage.Repository) *HealthService {
	return &HealthService{
		repositories: repositories,
	}
}

func (s *HealthService) HealthCheck(ctx context.Context) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	return s.repositories.HealthCheck(ctx)
}
