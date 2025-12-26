# Use Node.js LTS version
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration files
FROM base AS deps
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY pnpm-lock.yaml* ./

# Create directory structure and copy package.json files for workspace dependencies
RUN mkdir -p ./packages/shared ./apps/frontend
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM deps AS builder
COPY . .

# Reinstall dependencies to ensure everything is properly linked after copying all files
# Set CI=true to make pnpm non-interactive
ENV CI=true
RUN pnpm install --frozen-lockfile

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

# Copy nginx configuration from builder stage
COPY --from=builder /app/apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

