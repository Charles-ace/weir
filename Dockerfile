# Dockerfile for WEIR Off-Chain Relayer Daemon
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application files and scripts
COPY scripts/ ./scripts/
COPY deployments/ ./deployments/
COPY .env.example ./.env.example

# Default command runs the relayer daemon
ENV NODE_ENV=production
CMD ["node", "scripts/relayer.js"]
