# Multi-stage build for the backend workspace

FROM node:20-alpine AS build
WORKDIR /app

# Copy root manifest & lockfile plus backend workspace manifest
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json

# Install only backend workspace deps (skip frontend)
RUN npm ci --workspace backend --include-workspace-root=false

# Copy backend source and build TypeScript
COPY backend/ backend/
RUN npm run build --workspace backend

# Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app

# Bring only the backend deps and compiled output
COPY --from=build /app/node_modules ./node_modules
RUN npm prune --omit=dev
COPY --from=build /app/backend/package.json backend/package.json
COPY --from=build /app/backend/dist backend/dist

EXPOSE 4000
CMD ["node", "backend/dist/server.js"]
