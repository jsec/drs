FROM node:26-alpine AS web
WORKDIR /src/web

RUN npm install -g pnpm@11.20.0
COPY web/package.json web/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY web/ ./
RUN pnpm build

FROM golang:1.26-alpine AS api
WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download
COPY cmd/ cmd/
COPY internal/ internal/
COPY web/embed.go web/
COPY --from=web /src/web/dist web/dist
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /drs ./cmd/drs

FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=api /drs /drs
EXPOSE 3000
ENTRYPOINT ["/drs", "serve"]
