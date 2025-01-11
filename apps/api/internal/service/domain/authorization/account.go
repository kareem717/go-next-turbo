package authorization

import (
	"api/internal/entities/account"
	"context"

	"github.com/google/uuid"
)

func (s *AuthorizationService) CanCreateAccount(ctx context.Context, userId uuid.UUID) (bool, error) {
	return true, nil
}

func (s *AuthorizationService) CanAccessAccount(ctx context.Context, userId uuid.UUID, account account.Account) (bool, error) {
	return account.UserId == userId, nil
}