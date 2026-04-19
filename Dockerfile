# Stage 1: Build
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all code
COPY . .

# Set production API URL for the build
ARG VITE_API_URL=http://206.189.128.72:8000
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine as production-stage

# Copy built assets from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config if you have one, or use default
# EXPOSE 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
