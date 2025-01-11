package postgres

import (
	"context"
	"errors"
	"time"

	"api/internal/storage"
	"api/internal/storage/postgres/account"
	"api/internal/storage/postgres/project"

	"github.com/alexlast/bunzap"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"go.uber.org/zap"
)

// Config holds database connection configuration
type Config struct {
	URL                   string
	MaxConnections        int32
	MinConnections        int32
	MaxConnectionIdleTime time.Duration
	MaxConnectionLifetime time.Duration
}

// NewConfig creates a new Config with default values
func NewConfig(url string, options ...ConfigOption) Config {
	config := Config{
		URL:                   url,
		MaxConnections:        10,
		MinConnections:        1,
		MaxConnectionIdleTime: time.Hour,
		MaxConnectionLifetime: time.Hour,
	}

	for _, option := range options {
		option(&config)
	}

	return config
}

// Config option functions
type ConfigOption func(*Config)

func WithMaxConnections(maxConnections int32) ConfigOption {
	return func(c *Config) {
		c.MaxConnections = maxConnections
	}
}

func WithMinConnections(minConnections int32) ConfigOption {
	return func(c *Config) {
		c.MinConnections = minConnections
	}
}

func WithMaxConnectionIdleTime(maxConnectionIdleTime time.Duration) ConfigOption {
	return func(c *Config) {
		c.MaxConnectionIdleTime = maxConnectionIdleTime
	}
}

func WithMaxConnectionLifetime(maxConnectionLifetime time.Duration) ConfigOption {
	return func(c *Config) {
		c.MaxConnectionLifetime = maxConnectionLifetime
	}
}

// Repository implements storage.Repository interface
type repository struct {
	db      *bun.DB
	ctx     context.Context
	logger  *zap.Logger
	account *account.AccountRepository
	project *project.ProjectRepository
}

// Transaction implements storage.Transaction interface
type transaction struct {
	tx      *bun.Tx
	ctx     context.Context
	account *account.AccountRepository
	project *project.ProjectRepository
}

// New creates a new postgres repository instance
func New(ctx context.Context, config Config, logger *zap.Logger) storage.Repository {
	poolConfig, err := pgxpool.ParseConfig(config.URL)
	if err != nil {
		logger.Fatal("Error creating pool config", zap.Error(err))
	}

	poolConfig.MaxConns = config.MaxConnections
	poolConfig.MinConns = config.MinConnections
	poolConfig.MaxConnIdleTime = config.MaxConnectionIdleTime
	poolConfig.MaxConnLifetime = config.MaxConnectionLifetime

	sqldb := stdlib.OpenDB(*poolConfig.ConnConfig)
	db := bun.NewDB(sqldb, pgdialect.New())

	db.AddQueryHook(bunzap.NewQueryHook(bunzap.QueryHookOptions{
		Logger:       logger,
		SlowDuration: 200 * time.Millisecond,
	}))

	return &repository{
		db:      db,
		ctx:     ctx,
		logger:  logger,
		account: account.New(ctx, db),
		project: project.New(ctx, db),
	}
}

// Repository interface methods
func (r *repository) Account() storage.AccountRepository           { return r.account }
func (r *repository) Project() storage.ProjectRepository           { return r.project }
func (r *repository) NewTransaction() (storage.Transaction, error) { return newTx(r.ctx, r.db) }
func (r *repository) Shutdown(ctx context.Context) error           { r.db.Close(); return nil }

// Transaction interface methods
func (t *transaction) Account() storage.AccountRepository           { return t.account }
func (t *transaction) Project() storage.ProjectRepository           { return t.project }
func (t *transaction) Commit() error                                { return t.tx.Commit() }
func (t *transaction) Rollback() error                              { return t.tx.Rollback() }
func (t *transaction) SubTransaction() (storage.Transaction, error) { return newTx(t.ctx, t.tx) }

func (r *repository) RunInTx(ctx context.Context, fn func(ctx context.Context, tx storage.Transaction) error) error {
	tx, err := r.NewTransaction()
	if err != nil {
		return err
	}

	if err := fn(ctx, tx); err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}

func (r *repository) HealthCheck(ctx context.Context) error {
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	r.logger.Info("Attempting to ping the database...")
	if err := r.db.PingContext(pingCtx); err != nil {
		switch {
		case errors.Is(err, context.Canceled):
			r.logger.Fatal("ping was canceled by the client", zap.Error(err))
		case errors.Is(err, context.DeadlineExceeded):
			r.logger.Fatal("ping timed out", zap.Error(err))
		default:
			r.logger.Fatal("ping failed", zap.Error(err))
		}
		return err
	}

	r.logger.Info("Successfully connected to the database")
	return nil
}

func newTx(ctx context.Context, db bun.IDB) (storage.Transaction, error) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}

	return &transaction{
		tx:      &tx,
		ctx:     ctx,
		account: account.New(ctx, db),
		project: project.New(ctx, db),
	}, nil
}
