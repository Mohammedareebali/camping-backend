# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=development

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your application will run on
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]
