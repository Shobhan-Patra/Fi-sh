# Use an official Node.js base image
FROM node:24

RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --prod

# Copy the rest of the app
COPY . .

# Expose the backend port (if your app listens on 8080)
EXPOSE 8000

# Start the app
CMD ["pnpm", "start"]