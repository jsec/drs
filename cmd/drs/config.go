package main

import "os"

type config struct {
	appEnv      string
	databaseURL string
	githubToken string
	port        string
}

func loadConfig() config {
	return loadConfigFromEnv(os.Getenv)
}

func loadConfigFromEnv(getenv func(string) string) config {
	port := getenv("PORT")
	if port == "" {
		port = "3000"
	}

	return config{
		appEnv:      getenv("APP_ENV"),
		databaseURL: getenv("DATABASE_URL"),
		githubToken: getenv("GITHUB_TOKEN"),
		port:        port,
	}
}
