package account

import (
	"context"

	"api/internal/entities/account"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type AccountRepository struct {
	db  bun.IDB
	ctx context.Context
}

func New(ctx context.Context, db bun.IDB) *AccountRepository {
	return &AccountRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *AccountRepository) Create(ctx context.Context, userId uuid.UUID) (account.Account, error) {
	resp := account.Account{}

	err := r.db.
		NewInsert().
		Model((*account.Account)(nil)).
		Value("user_id", "?", userId).
		Scan(ctx, &resp)

	return resp, err
}

func (r *AccountRepository) GetById(ctx context.Context, id int32) (account.Account, error) {
	resp := account.Account{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *AccountRepository) GetByUserId(ctx context.Context, userId uuid.UUID) (account.Account, error) {
	resp := account.Account{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("user_id = ?", userId).
		Scan(ctx)

	return resp, err
}

func (r *AccountRepository) Delete(ctx context.Context, accountId int32) error {
	_, err := r.db.
		NewDelete().
		Model((*account.Account)(nil)).
		Where("id = ?", accountId).
		Exec(ctx)

	return err
}
