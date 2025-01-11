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
	shared.Timestamps
}
