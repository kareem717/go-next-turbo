package project

import (
	"context"

	"api/internal/entities/project"

	"github.com/uptrace/bun"
)

type ProjectRepository struct {
	db  bun.IDB
	ctx context.Context
}

func New(ctx context.Context, db bun.IDB) *ProjectRepository {
	return &ProjectRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *ProjectRepository) Create(ctx context.Context, ownerId int32, params project.CreateProjectParams) (project.Project, error) {
	resp := project.Project{}

	err := r.db.
		NewInsert().
		Model(params).
		Value("owner_id", "?", ownerId).
		Scan(ctx, &resp)

	return resp, err
}

func (r *ProjectRepository) GetById(ctx context.Context, id int32) (project.Project, error) {
	resp := project.Project{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *ProjectRepository) Update(ctx context.Context, id int32, params project.UpdateProjectParams) error {
	_, err := r.db.
		NewUpdate().
		Model(params).
		Where("id = ?", id).
		Exec(ctx)

	return err
}

func (r *ProjectRepository) Delete(ctx context.Context, id int32) error {
	_, err := r.db.
		NewDelete().
		Model((*project.Project)(nil)).
		Where("id = ?", id).
		Exec(ctx)

	return err
}

func (r *ProjectRepository) GetByOwnerId(ctx context.Context, ownerId int32) ([]project.Project, error) {
	resp := []project.Project{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("owner_id = ?", ownerId).
		Scan(ctx)

	return resp, err
}
