package api

import (
	"io/fs"
	"net/http"
	"strings"
)

func staticHandler(files fs.FS) http.Handler {
	fileServer := http.FileServerFS(files)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name := strings.TrimPrefix(r.URL.Path, "/")
		isAsset := strings.HasPrefix(name, "assets/")

		info, err := fs.Stat(files, name)
		isFile := err == nil && !info.IsDir()

		if isAsset && !isFile {
			http.NotFound(w, r)
			return
		}

		if !isFile {
			w.Header().Set("Cache-Control", "no-cache")
			http.ServeFileFS(w, r, files, "index.html")
			return
		}

		if isAsset {
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			w.Header().Set("Cache-Control", "no-cache")
		}

		fileServer.ServeHTTP(w, r)
	})
}
