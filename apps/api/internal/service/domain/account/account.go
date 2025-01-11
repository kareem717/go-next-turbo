package account

import (
	"context"

	"api/internal/entities/account"
	"api/internal/storage"

	"github.com/google/uuid"
)

type AccountService struct {
	repositories storage.Repository
}

func New(repositories storage.Repository) *AccountService {
	return &AccountService{
		repositories: repositories,
	}
}

func (s *AccountService) GetById(ctx context.Context, id int32) (account.Account, error) {
	return s.repositories.Account().GetById(ctx, id)
}

func (s *AccountService) GetByUserId(ctx context.Context, userId uuid.UUID) (account.Account, error) {
	return s.repositories.Account().GetByUserId(ctx, userId)
}

func (s *AccountService) Create(ctx context.Context, userId uuid.UUID) (account.Account, error) {
	return s.repositories.Account().Create(ctx, userId)
}

func (s *AccountService) Delete(ctx context.Context, id int32) error {
	return s.repositories.Account().Delete(ctx, id)
}
