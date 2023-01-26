# syntax=docker/dockerfile:1

# Use an customized image of Node.js
# https://hub.docker.com/_/node
FROM node:19-alpine

# Copy the website files to the container
COPY ./ /app

# Set the working directory to the client files
WORKDIR /app/client

# Duplicate the default environment file
# COPY .env.base .env isn't working for some reason ¯\_(ツ)_/¯
RUN cp .env.base .env

# Find and replace the database host, username and password
RUN sed -i "s/localhost/database/g" .env
RUN sed -i "s/<username>/root/g" .env
RUN sed -i "s/<password>/password/g" .env

# Set the working directory to the server files
WORKDIR /app/server

# Install the dependencies and build the project
RUN npm run setup && npm run build

# Expose the port 3001
EXPOSE 3001

# Run the website
CMD [ "node", "index.js" ]