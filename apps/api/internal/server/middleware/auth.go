package middleware

import (
	"api/internal/server/utils"
	"api/internal/service"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"go.uber.org/zap"

	"github.com/supabase-community/supabase-go"
)

// WithUser is a middleware that will get the user for the request
func WithUser(api huma.API) func(ctx huma.Context, next func(huma.Context), logger *zap.Logger, supabaseClient *supabase.Client) {
	return func(ctx huma.Context, next func(huma.Context), logger *zap.Logger, supabaseClient *supabase.Client) {
		authHeader := ctx.Header("Authorization")
		if authHeader == "" {
			huma.WriteErr(api, ctx, http.StatusUnauthorized,
				"No authorization header was provided",
			)
			return
		}

		accessToken, err := parseBearerToken(authHeader)
		if err != nil {
			huma.WriteErr(api, ctx, http.StatusUnauthorized,
				err.Error(),
			)
			return
		}

		authedClient := supabaseClient.Auth.WithToken(accessToken)

		resp, err := authedClient.GetUser()
		if err != nil {
			logger.Error("Error getting user", zap.Error(err))
			huma.WriteErr(api, ctx, http.StatusUnauthorized,
				"An invalid access token was provided",
			)
			return
		}

		next(huma.WithValue(ctx, utils.UserContextKey, &resp.User))
	}
}

// WithAccount is a middleware that will get the account for the request. It requires that the `WithUser` middleware has already been called.
func WithAccount(api huma.API) func(ctx huma.Context, next func(huma.Context), logger *zap.Logger, sv *service.Service) {
	return func(ctx huma.Context, next func(huma.Context), logger *zap.Logger, sv *service.Service) {
		user := utils.GetAuthenticatedUser(ctx.Context())
		if user == nil {
			huma.WriteErr(api, ctx, http.StatusUnauthorized,
				"User not authenticated",
			)
			return
		}

		queryResp, err := sv.AccountService.GetByUserId(ctx.Context(), user.ID)
		if err != nil {
			logger.Error("Error getting account", zap.Error(err))
			huma.WriteErr(api, ctx, http.StatusInternalServerError,
				"Something went wrong",
			)
			return
		}

		next(huma.WithValue(ctx, utils.AccountContextKey, &queryResp))
	}
}
