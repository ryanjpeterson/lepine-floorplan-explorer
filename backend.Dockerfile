FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY backend/ ./

# Build admin panel
RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "develop"]
