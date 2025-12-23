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
COPY apps/game-server/package.json ./apps/game-server/

# Install dependencies
RUN pnpm install

# Build stage
FROM deps AS builder
COPY . .

# Build the game-server and its dependencies
RUN pnpm --filter @repo/shared build
RUN pnpm --filter @repo/game-server build

# Production stage
FROM base AS runner
WORKDIR /app

# Copy package.json files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/game-server/package.json ./apps/game-server/
COPY packages/shared/package.json ./packages/shared/

# Install production dependencies only
RUN pnpm install --prod

# Copy built files
COPY --from=builder /app/apps/game-server/dist ./apps/game-server/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Copy source files needed at runtime (if any)
COPY --from=builder /app/apps/game-server/package.json ./apps/game-server/

# Set working directory to game-server
WORKDIR /app/apps/game-server

# Expose the port
EXPOSE 8080

# Run the server
CMD ["node", "dist/server.js"]

