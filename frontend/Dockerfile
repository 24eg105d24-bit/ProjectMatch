# ==============================================================================
# Multi-Stage Dockerfile for ProjectMatch Frontend (React 19 / Vite / Nginx)
# ==============================================================================

# Stage 1: Build static distribution with Node.js 22
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests and install dependencies cleanly
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Optional build argument for API URL (defaults to empty for Nginx reverse-proxying)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Build production bundle to /app/dist
RUN npm run build

# Stage 2: Serve static bundle via high-performance Nginx web server
FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

# Remove default static pages
RUN rm -rf ./*

# Copy built production assets from builder stage
COPY --from=builder /app/dist .

# Copy custom Nginx configuration supporting SPA routing and API reverse-proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check for Nginx server
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
