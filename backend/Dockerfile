# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy root manifest + lockfile (monorepo)
COPY package.json package-lock.json ./
# Copy backend workspace manifest so npm knows about it before install
COPY backend/package.json backend/package.json

# Install deps (all workspaces). If you want ONLY backend deps, you can do:
# RUN npm ci --workspace backend --include-workspace-root=false
RUN npm ci

# Copy backend source
COPY backend/ backend/

# Build backend (workspace script)
RUN npm run build --workspace backend

# Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy root manifests (optional, useful for introspection)
COPY --from=build /app/package.json /app/package-lock.json ./
# Copy backend package manifest
COPY --from=build /app/backend/package.json backend/package.json

# Copy node_modules (only backend's slice)
# Simplest: copy all then prune dev deps
COPY --from=build /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Copy compiled backend output
COPY --from=build /app/backend/dist backend/dist

EXPOSE 4000
CMD ["node", "backend/dist/server.js"]
