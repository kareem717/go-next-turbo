package account

import (
	"context"
	"database/sql"
	"errors"

	"api/internal/entities/account"
	"api/internal/server/utils"
	"api/internal/service"

	"github.com/danielgtaylor/huma/v2"
	"go.uber.org/zap"
)

type accountHandler struct {
	service *service.Service
	logger  *zap.Logger
}

func newAccountHandler(service *service.Service, logger *zap.Logger) *accountHandler {
	if service == nil {
		panic("service is nil")
	}

	if logger == nil {
		panic("logger is nil")
	}

	return &accountHandler{
		service: service,
		logger:  logger,
	}
}

type singleAccountResponse struct {
	Body struct {
		Account account.Account `json:"account"`
	}
}

func (h *accountHandler) getByUserId(ctx context.Context, input *struct{}) (*singleAccountResponse, error) {
	user := utils.GetAuthenticatedUser(ctx)
	if user == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	account, err := h.service.AccountService.GetByUserId(ctx, user.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Account not found")
		default:
			h.logger.Error("failed to fetch account", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the account")
		}
	}

	canAccess, err := h.service.AuthorizationService.CanAccessAccount(ctx, user.ID, account)
	if err != nil {
		h.logger.Error("failed to check if user can access account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if user can access account")
	}

	if !canAccess {
		return nil, huma.Error403Forbidden("You are not authorized to access this account")
	}

	resp := &singleAccountResponse{}
	resp.Body.Account = account

	return resp, nil
}

type createAccountRequest struct {
	Body account.CreateAccountParams
}

func (h *accountHandler) create(ctx context.Context, input *createAccountRequest) (*singleAccountResponse, error) {
	user := utils.GetAuthenticatedUser(ctx)
	if user == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	canCreate, err := h.service.AuthorizationService.CanCreateAccount(ctx, user.ID)
	if err != nil {
		h.logger.Error("failed to check if user can create account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if user can create account")
	}

	if !canCreate {
		return nil, huma.Error403Forbidden("You are not authorized to create an account")
	}

	account, err := h.service.AccountService.Create(ctx, user.ID, input.Body)
	if err != nil {
		h.logger.Error("failed to create account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the account")
	}

	resp := &singleAccountResponse{}
	resp.Body.Account = account

	return resp, nil
}

func (h *accountHandler) delete(ctx context.Context, input *struct{}) (*struct{}, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	err := h.service.AccountService.Delete(ctx, account.ID)
	if err != nil {
		h.logger.Error("failed to delete account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the account")
	}

	return &struct{}{}, nil
}

type updateAccountRequest struct {
	Body  account.UpdateAccountParams
}

func (h *accountHandler) update(ctx context.Context, input *updateAccountRequest) (*struct{}, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	err := h.service.AccountService.Update(ctx, account.ID, input.Body)
	if err != nil {
		h.logger.Error("failed to update account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the account")
	}

	return &struct{}{}, nil
}
