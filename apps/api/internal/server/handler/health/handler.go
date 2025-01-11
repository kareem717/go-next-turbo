package health

import (
	"context"

	"api/internal/service"

	"go.uber.org/zap"
)

type healthHandler struct {
	service *service.Service
	logger  *zap.Logger
}

func newHealthHandler(service *service.Service, logger *zap.Logger) *healthHandler {
	if service == nil {
		panic("service is nil")
	}

	if logger == nil {
		panic("logger is nil")
	}

	return &healthHandler{
		service: service,
		logger:  logger,
	}
}

type healthCheckOutput struct {
	Body struct {
		Message string `json:"message"`
	}
}

func (h *healthHandler) healthCheck(ctx context.Context, input *struct{}) (*healthCheckOutput, error) {
	err := h.service.HealthService.HealthCheck(ctx)
	if err != nil {
		h.logger.Error("failed to health check", zap.Error(err))
	}

	resp := &healthCheckOutput{}
	resp.Body.Message = "Health check passed"

	return resp, nil
}
