package main

import "testing"

func TestLoadConfig(t *testing.T) {
	tests := []struct {
		name string
		env  map[string]string
		want config
	}{
		{
			name: "reads configured values",
			env: map[string]string{
				"APP_ENV":      "production",
				"DATABASE_URL": "postgres://db/drs",
				"GITHUB_TOKEN": "token",
				"PORT":         "8080",
			},
			want: config{
				appEnv:      "production",
				databaseURL: "postgres://db/drs",
				githubToken: "token",
				port:        "8080",
			},
		},
		{
			name: "defaults port",
			env:  map[string]string{},
			want: config{port: "3000"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := loadConfigFromEnv(func(key string) string { return tt.env[key] })
			if got != tt.want {
				t.Fatalf("loadConfig() = %#v, want %#v", got, tt.want)
			}
		})
	}
}
