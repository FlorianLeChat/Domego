# syntax=docker/dockerfile:1

# Use an customized image of Node.js
# https://hub.docker.com/_/node
FROM node:lts-alpine

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

# Find and replace the database host, username and password
RUN sed -i "s/MONGODB_HOST=localhost/MONGODB_DATABASE=database/g" .env
RUN sed -i "s/MONGODB_USERNAME=username/MONGODB_USERNAME=root/g" .env
RUN sed -i "s/MONGODB_PASSWORD=password/MONGODB_PASSWORD=password/g" .env

# Build the entire project
RUN npm run build

# Change the ownership of the build files
RUN chown -R node:node /usr/src/app/.next

# Remove all development dependencies
RUN npm prune --production

# Use non-root user
USER node

# Expose the port 3000
EXPOSE 3000

# Run the website
CMD [ "npx", "next", "start" ]