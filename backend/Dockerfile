# Use official Node.js LTS image
FROM node:20-alpine3.19

# Update Alpine packages to fix vulnerabilities
RUN apk update && apk upgrade --no-cache

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Build the NestJS app
RUN npm run build

# Verify build output exists
RUN ls -la dist/

# Optionally prune devDependencies to reduce image size
RUN npm prune --production

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
