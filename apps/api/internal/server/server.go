package server

import (
	"context"
	"net/http"

	"api/internal/server/handler/account"
	"api/internal/server/handler/health"
	"api/internal/server/handler/project"
	"api/internal/server/middleware"
	"api/internal/service"

	"github.com/supabase-community/supabase-go"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"go.uber.org/zap"
)

type ServerConfig struct {
	apiName    string
	apiVersion string
}

type ServerOptFunc func(*ServerConfig) *ServerConfig

func WithAPIName(name string) ServerOptFunc {
	return func(config *ServerConfig) *ServerConfig {
		config.apiName = name
		return config
	}
}

func WithAPIVersion(version string) ServerOptFunc {
	return func(config *ServerConfig) *ServerConfig {
		config.apiVersion = version
		return config
	}
}

type Server struct {
	services                   *service.Service
	logger                     *zap.Logger
	config                     *ServerConfig
	humaApi                    huma.API
	router                     *chi.Mux
	supabaseClient             *supabase.Client
}

func NewServer(
	services *service.Service,
	logger *zap.Logger,
	supabaseClient *supabase.Client,
	opts ...ServerOptFunc,
) *Server {
	config := &ServerConfig{
		apiName:    "API",
		apiVersion: "1.0.0",
	}

	for _, opt := range opts {
		config = opt(config)
	}

	r := chi.NewMux()

	// Add CORS middleware
	corsOptions := cors.Options{
		AllowedOrigins:   []string{"*"}, // Add your allowed origins here
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}

	r.Use(cors.Handler(corsOptions))
	r.Use(middleware.Logger(logger))
	r.Use(chiMiddleware.Recoverer)

	humaConfig := huma.DefaultConfig(config.apiName, config.apiVersion)
	humaConfig.Components.SecuritySchemes = map[string]*huma.SecurityScheme{
		"bearerAuth": {
			Type:         "http",
			Scheme:       "bearer",
			BearerFormat: "JWT",
		},
	}

	humaApi := humachi.New(r, humaConfig)

	server := Server{
		services:                   services,
		logger:                     logger,
		config:                     config,
		humaApi:                    humaApi,
		router:                     r,
		supabaseClient:             supabaseClient,
	}

	server.registerRoutes()

	return &server
}

func (s *Server) Serve(port string) error {
	s.logger.Info("Server started!", zap.String("port", port))
	return http.ListenAndServe(port, s.router)
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.services.Shutdown(ctx)
}

func (s *Server) OpenAPI() ([]byte, error) {
	return s.humaApi.OpenAPI().DowngradeYAML()
}

func (s *Server) registerRoutes() {
	account.RegisterHumaRoutes(
		s.services,
		s.humaApi,
		s.logger,
		s.supabaseClient,
	)

	health.RegisterHumaRoutes(
		s.services,
		s.humaApi,
		s.logger,
	)

	account.RegisterHumaRoutes(
		s.services,
		s.humaApi,
		s.logger,
		s.supabaseClient,
	)

	project.RegisterHumaRoutes(
		s.services,
		s.humaApi,
		s.logger,
		s.supabaseClient,
	)

	health.RegisterHumaRoutes(
		s.services,
		s.humaApi,
		s.logger,
	)

}
