# Dockerfile for NFT contract testing with Hardhat
FROM node:18-bullseye

# Avoid running as root in container for safety
WORKDIR /app

# Copy package files first to leverage layer cache
COPY package.json package-lock.json* /app/

# Install dependencies (use legacy-peer-deps to avoid npm peer resolution failures)
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy project files
COPY . /app

# Ensure solidity compiler cache directories exist
RUN mkdir -p /app/cache /app/artifacts || true

# Compile contracts (do this at build-time)
RUN npx hardhat compile

# Default command: run the test suite (no TTY)
CMD ["npx", "hardhat", "test", "--no-compile"]
