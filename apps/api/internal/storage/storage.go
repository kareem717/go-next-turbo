package storage

import (
	"context"

	"api/internal/entities/account"
	"api/internal/entities/project"

	"github.com/google/uuid"
)

type AccountRepository interface {
	Create(ctx context.Context, userId uuid.UUID, params account.CreateAccountParams) (account.Account, error)
	Update(ctx context.Context, id int32, params account.UpdateAccountParams) error
	GetById(ctx context.Context, id int32) (account.Account, error)
	Delete(ctx context.Context, id int32) error

	GetByUserId(ctx context.Context, userId uuid.UUID) (account.Account, error)
}

type ProjectRepository interface {
	Create(ctx context.Context, ownerId int32, params project.CreateProjectParams) (project.Project, error)
	GetById(ctx context.Context, id int32) (project.Project, error)
	Update(ctx context.Context, id int32, params project.UpdateProjectParams) error
	Delete(ctx context.Context, id int32) error

	GetByOwnerId(ctx context.Context, ownerId int32) ([]project.Project, error)
}

type RepositoryProvider interface {
	Account() AccountRepository
	Project() ProjectRepository
}

type Transaction interface {
	RepositoryProvider
	Commit() error
	Rollback() error
	SubTransaction() (Transaction, error)
}

type Repository interface {
	RepositoryProvider
	HealthCheck(ctx context.Context) error
	NewTransaction() (Transaction, error)
	RunInTx(ctx context.Context, fn func(ctx context.Context, tx Transaction) error) error
	Shutdown(ctx context.Context) error
}
