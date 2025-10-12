# Start with a base image. This is an official, lightweight Node.js v20 image.
FROM node:22-slim

# Set the working directory inside the container.
WORKDIR /app

COPY package*.json ./

RUN npm install --production

# Copy the rest of your application's source code into the container.
COPY . .

# Expose the port your application runs on.
# This is just for documentation; the -p flag in "docker run" actually opens the port.
EXPOSE 8000

# Define the command to run your application when the container starts.
CMD [ "node", "config/server.js" ] 