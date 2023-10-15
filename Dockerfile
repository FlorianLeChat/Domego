# syntax=docker/dockerfile:1

# Use an customized image of Node.js
# https://hub.docker.com/_/node
FROM node:lts-alpine

# Add cURL for health check
RUN apk --no-cache add curl

# Set the working directory to the website files
WORKDIR /usr/src/app

# Copy only files required to install dependencies
COPY --chown=node:node package*.json .

# Install all dependencies
# Use cache mount to speed up installation of existing dependencies
RUN --mount=type=cache,target=/usr/src/app/.npm \
	npm set cache /usr/src/app/.npm && \
	npm install

# Change ownership of the installed dependencies
RUN chown -R node:node /usr/src/app/node_modules

# Copy the remaining files AFTER installing dependencies
COPY --chown=node:node . .

# Find and replace the database host and password
RUN sed -i "s/MONGODB_HOST=127.0.0.1/MONGODB_HOST=mongo/g" .env
RUN sed -i "s/MONGODB_PASSWORD=password/MONGODB_PASSWORD=$(cat /usr/src/app/docker/config/db_root_password.txt | tr -d '\n')/g" .env

# Build the entire project
RUN npm run build

# Change the ownership of the build files
RUN chown -R node:node /usr/src/app/.next

# Use non-root user
USER node

# Expose the port 3000
EXPOSE 3000

# Run the website
CMD [ "npm", "run", "start" ]