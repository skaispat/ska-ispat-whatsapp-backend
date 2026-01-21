# ================================
# Node.js Backend Dockerfile
# ================================

# Stage 1: Base image
FROM node:20-alpine AS base
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS deps
# Copy package files
COPY package*.json ./
# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 3: Production image
FROM base AS production

# Set environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodeuser:nodejs . .

# Switch to non-root user
USER nodeuser

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "index.js"]
