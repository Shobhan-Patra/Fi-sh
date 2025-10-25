# Use an official Node.js base image
FROM node:24

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# Expose the backend port (if your app listens on 8080)
EXPOSE 8000

# Start the app
CMD ["npm", "start"]
