FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Create directories for storage
RUN mkdir -p /app/videos /app/uploads

# Start server
CMD ["npm", "start"]
