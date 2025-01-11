package account

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

	handler := newAccountHandler(service, logger)

	huma.Register(humaApi, huma.Operation{
		OperationID:   "createAccount",
		Method:        http.MethodPost,
		Path:          "/account",
		Summary:       "Create an account",
		Description:   "Creates an account for the currently authenticated user.",
		Tags:          []string{"Accounts"},
		DefaultStatus: http.StatusCreated,
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
		},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "getAccount",
		Method:      http.MethodGet,
		Path:        "/account",
		Summary:     "Get your account",
		Description: "Fetches the account for the currently authenticated user.",
		Tags:        []string{"Account"},
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
	}, handler.getByUserId)

	huma.Register(humaApi, huma.Operation{
		OperationID: "deleteAccount",
		Method:      http.MethodDelete,
		Path:        "/account",
		Summary:     "Delete your account",
		Description: "Deletes the account for the currently authenticated user.",
		Tags:        []string{"Accounts"},
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
}
