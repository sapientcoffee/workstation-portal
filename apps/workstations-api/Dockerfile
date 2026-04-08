# Use Node.js as the base image
FROM node:20-alpine3.19

# Set working directory
WORKDIR /app

# Copy package descriptors
# Note: package.json has both frontend and backend dependencies, 
# but installing production skips Vite and React devDependencies if configured correctly.
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the server code
COPY server.js ./

# Expose the API port
EXPOSE 3001

# Start the Node Express backend
CMD ["node", "server.js"]
