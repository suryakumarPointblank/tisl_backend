# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start:prod"]
