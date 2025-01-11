package account

import (
	"api/internal/entities/shared"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type Account struct {
	bun.BaseModel `bun:"table:accounts"`

	shared.IntegerID
	UserId uuid.UUID `json:"user_id"`
	UsernameField
	shared.Timestamps
}

type CreateAccountParams struct {
	bun.BaseModel `bun:"table:accounts"`
	
	UsernameField
}

type UpdateAccountParams struct {
	bun.BaseModel `bun:"table:accounts"`

	*UsernameField
}
