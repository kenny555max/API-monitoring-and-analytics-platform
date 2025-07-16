FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy source code
COPY apps/api-monitoring-platform ./apps/api-monitoring-platform
COPY libs ./libs

# Install dependencies
RUN npm ci --only=production

# Build the application
RUN npx nx build api-monitoring-platform

# Expose port
#EXPOSE 3000 - already exposing PORT from the Docker compose

COPY . .

# Start the application
CMD ["node", "dist/apps/api-monitoring-platform/main.js"]
