# -------------------------
# Stage 1: Build Stage
# -------------------------
FROM node:22.11.0-slim AS builder

# Set working directory inside the container
WORKDIR /app

# Copy only dependency files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the full source code into the container
COPY . .

# Build-time environment variables (e.g., for API endpoints)
ARG NEXT_PUBLIC_API_BASE_URL

# Set environment variables needed during build
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    NEXT_TELEMETRY_DISABLED=1

# Build the Next.js app and clean up unnecessary cache
RUN npm run build && \
    rm -rf .next/cache && \
    npm cache clean --force

# -------------------------
# Stage 2: Production Stage
# -------------------------
FROM node:22.11.0-slim

# Set environment variables for production runtime
ENV NODE_ENV=production \
    HUSKY=0 \
    NEXT_TELEMETRY_DISABLED=1

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN useradd -m appuser

# Copy only the production artifacts from the build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Install only production dependencies, prune unnecessary packages, and clean up
RUN npm install --omit=dev && \
    npm prune --omit=dev && \
    npm cache clean --force && \
    chown -R appuser:appuser /app

# Switch to the non-root user for runtime
USER appuser

# Expose the app port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
