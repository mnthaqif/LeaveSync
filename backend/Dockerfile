# Multi-stage build for the backend workspace

FROM node:20-alpine AS build
WORKDIR /app

# Copy root manifest & lockfile (monorepo) plus backend workspace package.json
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json

# Install only backend workspace deps (skip frontend)
RUN npm ci --workspace backend --include-workspace-root=false

# Copy backend source
COPY backend/ backend/

# Build TypeScript (workspace script)
RUN npm run build --workspace backend

# Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy backend package manifest (optional root manifests if you want)
COPY --from=build /app/backend/package.json backend/package.json

# Copy only the backend node_modules (we installed only backend deps above)
COPY --from=build /app/node_modules ./node_modules

# Remove any dev deps
RUN npm prune --omit=dev

# Copy compiled output
COPY --from=build /app/backend/dist backend/dist

EXPOSE 4000
CMD ["node", "backend/dist/server.js"]
