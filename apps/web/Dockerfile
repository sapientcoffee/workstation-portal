# Stage 1: Build the React Application
FROM node:20 as build

WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install all dependencies (including devDependencies like Vite)
RUN npm install

# Copy source code
COPY . .

# Removed empty ARG VITE_API_URL so it reads from .env.production

# Build the project
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25.4-alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx is listening on
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
