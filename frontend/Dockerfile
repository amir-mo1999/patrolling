# Use an official Node.js runtime as the base image with Node.js 20
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /home/appuser

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Specify the command to run your application
CMD ["yarn", "dev"]
