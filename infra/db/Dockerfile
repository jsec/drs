FROM postgres:18-alpine@sha256:0115267ab5a509022df9319c77be365cef335adb71556c75f60f5360ee247e71 AS builder
ENV PGDATA=/pgdata

RUN install -d -o postgres -g postgres /pgdata
COPY effone.dump restore.sh /
USER postgres
RUN --mount=type=secret,id=db_password,mode=0444 sh /restore.sh

FROM postgres:18-alpine@sha256:0115267ab5a509022df9319c77be365cef335adb71556c75f60f5360ee247e71
ENV PGDATA=/pgdata

COPY --from=builder --chown=postgres:postgres /pgdata /pgdata
