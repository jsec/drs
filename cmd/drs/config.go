package main

import (
	"cmp"
	"os"
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
