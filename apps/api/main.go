package main

import (
	"context"
	"fmt"
	"os"
	"strconv"
	"time"

	server "api/internal/server"
	"api/internal/service"
	"api/internal/storage/postgres"

	"github.com/danielgtaylor/huma/v2/humacli"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	"github.com/supabase-community/supabase-go"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Options struct {
	Port               int    `help:"Port to listen on" short:"p" default:"8080"`
	DatabaseURL        string `help:"Database URL" short:"d"`
	APIName            string `help:"API Name" short:"a"`
	APIVersion         string `help:"API Version" short:"v"`
	BaseURL            string `help:"Base API URL" short:"B"`
	SupabaseHost       string `help:"Supabase Host" short:"s"`
	SupabaseServiceKey string `help:"Supabase Service Key" short:"k"`

	RunHealthCheck bool `help:"Run Health Check" short:"H" default:"true"`
}

func (o *Options) config() {
	if port, err := strconv.Atoi(os.Getenv("PORT")); err == nil {
		o.Port = port
	}

	o.DatabaseURL = os.Getenv("DATABASE_URL")
	o.BaseURL = os.Getenv("BASE_API_URL")

	o.SupabaseHost = os.Getenv("SUPABASE_HOST")
	o.SupabaseServiceKey = os.Getenv("SUPABASE_SERVICE_KEY")
}

func main() {
	// Load environment variables from .env.local
	err := godotenv.Load(".env.local")
	if err != nil {
		fmt.Println("Error loading .env.local file")
	}

	serverInstance := new(server.Server)

	cli := humacli.New(func(hooks humacli.Hooks, options *Options) {
		options.config()

		ctx := context.Background()
		logger := zap.New(
			zapcore.NewCore(
				zapcore.NewJSONEncoder(zap.NewProductionConfig().EncoderConfig),
				zapcore.AddSync(os.Stdout), zap.InfoLevel))

		repositories := postgres.New(
			ctx,
			postgres.NewConfig(options.DatabaseURL),
			logger,
		)

		if options.RunHealthCheck && err != nil {
			logger.Fatal("Failed to create repository layer", zap.Error(err))
		}

		services := service.NewService(
			repositories,
		)

		supabaseClient, err := supabase.NewClient(
			options.SupabaseHost,
			options.SupabaseServiceKey,
			&supabase.ClientOptions{},
		)
		if err != nil {
			logger.Fatal("Failed to create supabase client", zap.Error(err))
		}

		serverInstance = server.NewServer(
			services,
			logger,
			supabaseClient,
			server.WithAPIName(options.APIName),
			server.WithAPIVersion(options.APIVersion),
		)

		hooks.OnStart(func() {
			logger.Info("Starting server...", zap.Int("port", options.Port))

			if options.RunHealthCheck {
				logger.Info("Starting health check...", zap.Int("port", options.Port))
				logger.Info("(1/2) Checking database status...")
				err := repositories.HealthCheck(ctx)
				if err != nil {
					logger.Fatal("Health check failed", zap.Error(err))
				}

				logger.Info("(2/2) Checking service status...")
				err = services.HealthService.HealthCheck(ctx)
				if err != nil {
					logger.Fatal("Health check failed", zap.Error(err))
				}

				logger.Info("Health check completed successfully!")
			}

			serverInstance.Serve(fmt.Sprintf(":%d", options.Port))
		})

		hooks.OnStop(func() {
			shutdownTimeout := 5 * time.Second
			logger.Info("Beginning server graceful shutdown...", zap.Duration("timeout", shutdownTimeout))

			// Give the server 5 seconds to gracefully shut down, then give up.
			ctx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
			defer cancel()

			start := time.Now()

			serverInstance.Shutdown(ctx)

			duration := time.Since(start)

			logger.Info("Server shutdown completed successfully!", zap.Int64("duration_ns", duration.Nanoseconds()))
		})
	})

	// Add a command to print the OpenAPI spec.
	cli.Root().AddCommand(&cobra.Command{
		Use:   "openapi",
		Short: "Print the OpenAPI spec",
		Run: func(cmd *cobra.Command, args []string) {
			b, err := serverInstance.OpenAPI()
			if err != nil {
				fmt.Printf("Error generating OpenAPI spec: %v\n", err)
				return
			}

			// Write the OpenAPI spec to a file.
			err = os.WriteFile("openapi.yaml", b, 0644)
			if err != nil {
				fmt.Printf("Error writing OpenAPI spec to file: %v\n", err)
				return
			}

			fmt.Println("OpenAPI spec written to openapi.yaml")
		},
	})

	cli.Run()
}
