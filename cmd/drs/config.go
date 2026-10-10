package main

import (
	"cmp"
	"context"
	"errors"
	"os"

	"github.com/urfave/cli/v3"
)

type config struct {
	appEnv      string
	databaseURL string
	githubToken string
	port        string
}

func loadConfig() config {
	return config{
		appEnv:      os.Getenv("APP_ENV"),
		databaseURL: os.Getenv("DATABASE_URL"),
		githubToken: os.Getenv("GITHUB_TOKEN"),
		port:        cmp.Or(os.Getenv("PORT"), "3000"),
	}
}

func (c config) requireDatabaseURL(ctx context.Context, _ *cli.Command) (context.Context, error) {
	if c.databaseURL == "" {
		return ctx, errors.New("DATABASE_URL is required")
	}

	return ctx, nil
}
