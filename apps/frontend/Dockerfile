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
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN pnpm install

# Build stage
FROM deps AS builder
COPY . .

# Accept build argument for WebSocket URL
ARG VITE_WS_URL=ws://localhost:8080
ENV VITE_WS_URL=$VITE_WS_URL

# Build the shared package and frontend
RUN pnpm --filter @repo/shared build
RUN pnpm --filter frontend build

# Production stage with nginx
FROM nginx:alpine AS runner

# Copy built static files from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

