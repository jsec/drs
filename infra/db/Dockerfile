FROM postgres:18-alpine@sha256:123b17998ccaf47e53b502e8c6a1e79afd8f579c6f3eec83c563da026f957395 AS builder
ENV PGDATA=/pgdata

RUN install -d -o postgres -g postgres /pgdata
COPY effone.dump restore.sh /
USER postgres
RUN --mount=type=secret,id=db_password,mode=0444 sh /restore.sh

FROM postgres:18-alpine@sha256:123b17998ccaf47e53b502e8c6a1e79afd8f579c6f3eec83c563da026f957395
ENV PGDATA=/pgdata

COPY --from=builder --chown=postgres:postgres /pgdata /pgdata
