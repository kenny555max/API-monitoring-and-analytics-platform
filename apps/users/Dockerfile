FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY yarn.lock* ./

# Copy all necessary Nx workspace files
COPY nx.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./

# Install ALL dependencies (dev dependencies are needed for Nx build)
RUN npm ci

# Copy the entire workspace structure
COPY apps/ ./apps/
COPY libs/ ./libs/

# Build the application
RUN npx nx build users

# Expose port
#EXPOSE 3000 - already exposing PORT from the Docker compose

# Start the application
CMD ["node", "dist/apps/users/main.js"]
