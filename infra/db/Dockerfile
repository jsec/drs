FROM postgres:18-alpine AS builder
ENV PGDATA=/pgdata

RUN install -d -o postgres -g postgres /pgdata
COPY effone.dump restore.sh /
USER postgres
RUN --mount=type=secret,id=db_password,mode=0444 sh /restore.sh

FROM postgres:18-alpine
ENV PGDATA=/pgdata
LABEL org.opencontainers.image.source=https://github.com/jsec/drs

COPY --from=builder --chown=postgres:postgres /pgdata /pgdata
