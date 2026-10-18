package web

import (
	"embed"
	"io/fs"
)

//go:embed all:dist
var dist embed.FS

func Files() fs.FS {
	files, err := fs.Sub(dist, "dist")
	if err != nil {
		panic(err)
	}

	return files
}
