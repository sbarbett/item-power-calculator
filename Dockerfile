# 1) Build stage
FROM node:16-alpine AS build

WORKDIR /app

# Copy package.json and lockfile (if you have one)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy everything else and build
COPY public ./public
COPY src ./src

RUN npm run build

# 2) Production stage: serve with Nginx
FROM nginx:stable-alpine

# Remove default Nginx static contents
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to Nginx’s html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
