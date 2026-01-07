FROM node:23-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Run with experimental TypeScript support
CMD ["node", "--experimental-strip-types", "server.ts"]
