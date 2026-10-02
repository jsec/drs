package main

import "os"

type config struct {
	appEnv      string
	databaseURL string
	githubToken string
	port        string
}

func loadConfig() config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	return config{
		appEnv:      os.Getenv("APP_ENV"),
		databaseURL: os.Getenv("DATABASE_URL"),
		githubToken: os.Getenv("GITHUB_TOKEN"),
		port:        port,
	}
}
