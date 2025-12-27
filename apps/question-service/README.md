# Question Service

A REST API service built with Express 5, TypeScript, and TSyringe for dependency injection.

## Features

- **Express 5** - Modern Express framework
- **TypeScript** - Type-safe development
- **TSyringe** - Dependency injection container
- **Winston** - Structured logging
- **CORS** - Cross-origin resource sharing support
- **Global Error Handler** - Centralized error handling middleware

## Development

```bash
# Install dependencies (from root)
pnpm install

# Run in development mode
pnpm --filter @repo/question-service dev

# Build
pnpm --filter @repo/question-service build

# Type check
pnpm --filter @repo/question-service type-check

# Lint
pnpm --filter @repo/question-service lint
```

## Environment Variables

The service supports loading environment variables from a `.env` file in the `apps/question-service` directory for local development. See `.env.example` for a template.

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development, production)
- `LOG_LEVEL` - Winston log level (default: debug)
- `CORS_ORIGIN` - CORS allowed origin (default: \*)

To get started, copy `.env.example` to `.env` and customize as needed:

```bash
cp apps/question-service/.env.example apps/question-service/.env
```

## Docker

```bash
# Build and run with docker-compose
docker-compose up question-service

# Or build the image directly
docker build -f apps/question-service/Dockerfile -t question-service .
```

## API Endpoints

- `GET /health` - Health check endpoint
