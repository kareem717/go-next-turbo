package project

import (
	"api/internal/entities/shared"

	"github.com/uptrace/bun"
)

type Project struct {
	bun.BaseModel `bun:"table:projects"`

	shared.IntegerID
	OwnerId int32 `json:"owner_id"`
	NameField
	shared.Timestamps
}

type CreateProjectParams struct {
	bun.BaseModel `bun:"table:projects"`

	NameField
}

type UpdateProjectParams struct {
	bun.BaseModel `bun:"table:projects"`

	*NameField
}
