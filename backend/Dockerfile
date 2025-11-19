# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy lockfiles first for better cache
COPY package*.json ./
# Install all deps (dev + prod) needed to build TypeScript
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine AS runtime
WORKDIR /app

# Copy package files
COPY --from=build /app/package*.json ./

# Bring over node_modules from build and remove dev deps
COPY --from=build /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Copy only the compiled output
COPY --from=build /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/server.js"]
