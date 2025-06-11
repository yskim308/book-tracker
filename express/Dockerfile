# Use an official Node.js runtime as the base image.
# We choose a specific version (e.g., 20.x) and a slim variant for smaller image size.
# node:20-slim is a good balance between size and functionality.
FROM oven/bun:latest
# Set the working directory inside the container.
# All subsequent commands will be executed in this directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory.
# This allows caching of dependencies. If these files don't change, Docker can
# skip re-installing node_modules in subsequent builds, speeding up builds.
COPY package*.json ./
COPY bun*.lockb ./

# Install application dependencies.
# Use npm ci for clean installs in CI/CD and production environments.
# For local dev, npm install is fine, but npm ci is generally preferred for consistency.
RUN bun install

# Copy the rest of the application code to the working directory.
# The .dockerignore file will prevent unnecessary files from being copied.
COPY . .

# Expose the port your Express app listens on.
# This informs Docker that the container listens on the specified network ports at runtime.
# This does NOT publish the port; it's a declaration. You'll publish it with `docker run -p`.
EXPOSE 4000

# Define the command to run your application when the container starts.
# CMD specifies the default command when running the container.
# Use the exec form for better signal handling (e.g., graceful shutdown).
CMD [ "bun", "index.js" ]
# OR if your main entry file is app.js, use:
# CMD [ "node", "app.js" ]
# OR if you use a start script in package.json (recommended for most Node.js apps):
# CMD [ "npm", "start" ]
