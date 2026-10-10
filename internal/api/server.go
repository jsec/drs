package api

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"github.com/jsec/drs/internal/database"
)

type application struct {
	logger  *slog.Logger
	queries database.Querier
}

func Serve(ctx context.Context, logger *slog.Logger, db *database.Queries, port string) error {
	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           (&application{logger: logger, queries: db}).routes(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       time.Minute,
		ErrorLog:          slog.NewLogLogger(logger.Handler(), slog.LevelError),
	}

	errCh := make(chan error, 1)
	go func() {
		logger.Info("server listening", "addr", srv.Addr)
		errCh <- srv.ListenAndServe()
	}()

	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
	}

	logger.Info("shutdown signal received")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	return srv.Shutdown(shutdownCtx)
}
