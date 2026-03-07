# Build stage
FROM oven/bun:1.3.10 AS build
WORKDIR /app
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile --production
COPY . .
# Compile the application into a single binary
RUN bun build --compile --minify --sourcemap ./src/index.ts --outfile hono-app

# Production runner stage
FROM gcr.io/distroless/base-debian13:nonroot AS runner
ENV NODE_ENV=production
ARG BUILD_APP_PORT=3000
ENV APP_PORT=${BUILD_APP_PORT}
EXPOSE ${APP_PORT}
WORKDIR /app
# Copy the compiled executable from the build stage
COPY --from=build /app/hono-app .
ENTRYPOINT ["./hono-app"]
