# Use Node.js LTS version
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration files
FROM base AS deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy package.json files for workspace dependencies
COPY packages/shared/package.json ./packages/shared/
COPY apps/question-service/package.json ./apps/question-service/

# Install dependencies
RUN pnpm install

# Build stage
FROM deps AS builder
COPY . .

# Build the question-service and its dependencies
RUN pnpm --filter @repo/shared build
RUN pnpm --filter @repo/question-service build

# Production stage
FROM base AS runner
WORKDIR /app

# Copy package.json files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/question-service/package.json ./apps/question-service/
COPY packages/shared/package.json ./packages/shared/

# Install production dependencies only
RUN pnpm install --prod

# Copy built files
COPY --from=builder /app/apps/question-service/dist ./apps/question-service/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Copy source files needed at runtime (if any)
COPY --from=builder /app/apps/question-service/package.json ./apps/question-service/

# Set working directory to question-service
WORKDIR /app/apps/question-service

# Expose the port
EXPOSE 3000

# Run the server
CMD ["node", "dist/server.js"]

