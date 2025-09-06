# Use official Node.js LTS Alpine image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy source files
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port (default 3000, can be overridden by .env)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]

# Note: For environment variables, mount or copy .env file as needed
