package project

import (
	"net/http"

	"api/internal/server/middleware"
	"api/internal/service"
	"github.com/danielgtaylor/huma/v2"
	"github.com/supabase-community/supabase-go"
	"go.uber.org/zap"
)

func RegisterHumaRoutes(
	service *service.Service,
	humaApi huma.API,
	logger *zap.Logger,
	supabaseClient *supabase.Client,
) {

	handler := newProjectHandler(service, logger)

	huma.Register(humaApi, huma.Operation{
		OperationID:   "createProject",
		Method:        http.MethodPost,
		Path:          "/project",
		Summary:       "Create a project",
		Description:   "Creates a project for the currently authenticated account.",
		Tags:          []string{"Projects"},
		DefaultStatus: http.StatusCreated,
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "getProjectById",
		Method:      http.MethodGet,
		Path:        "/project/{id}",
		Summary:     "Get a project by id",
		Description: "Fetches a project by its id.",
		Tags:        []string{"Projects"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.getById)

	huma.Register(humaApi, huma.Operation{
		OperationID: "updateProject",
		Method:      http.MethodPut,
		Path:        "/project/{id}",
		Summary:     "Update a project",
		Description: "Updates a project using its id as an identifier.",
		Tags:        []string{"Projects"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.update)

	huma.Register(humaApi, huma.Operation{
		OperationID: "deleteProject",
		Method:      http.MethodDelete,
		Path:        "/project/{id}",
		Summary:     "Delete a project",
		Description: "Deletes a project by its id.",
		Tags:        []string{"Projects"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.delete)

	huma.Register(humaApi, huma.Operation{
		OperationID: "getProjectsByOwnerId",
		Method:      http.MethodGet,
		Path:        "/project",
		Summary:     "Get a project by owner id",
		Description: "Fetches all projects owned by the currently authenticated account.",
		Tags:        []string{"Projects"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.getByOwnerId)
}
