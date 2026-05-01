FROM node:20-alpine

# Install build tools for native dependencies (required for bcrypt)
RUN apk add --no-cache python3 make g++ 

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
# If you add a package-lock.json speed your build by switching to 'npm ci'.
RUN npm install

# Copy local code to the container image.
COPY . .

# Expose the port that the container will run on.
EXPOSE 8080

# Run the web service on container startup.
# We are using tsx to run the typescript server directly.
CMD [ "npm", "start" ]
