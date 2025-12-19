FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Dev
FROM base AS dev
RUN apt-get update && apt-get install -y procps
WORKDIR /app

# Build
FROM base AS build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --frozen-lockfile

# Build [prod]
FROM build AS build-prod
RUN pnpm deploy --filter @streamerbot/discord-docs-bot --prod /prod
RUN pnpm --filter @streamerbot/discord-docs-bot build

# Production
FROM base AS prod
COPY --from=build /app/healthcheck.mjs /prod/healthcheck.mjs
COPY --from=build-prod /prod /prod
COPY --from=build-prod /app/dist /prod/dist
WORKDIR /prod
HEALTHCHECK --interval=10s --timeout=10s CMD ["node", "healthcheck.mjs"]
CMD [ "pnpm", "start:prod" ]