# # # Use the official Node.js 18 image as a parent image
# # FROM node:18-alpine

# # # Set the working directory
# # WORKDIR /app

# # # Copy package.json and package-lock.json
# # COPY package*.json ./

# # # Install dependencies
# # RUN npm ci

# # # Copy the rest of your app's source code
# # COPY . .

# # # Build your Next.js app
# # RUN npm run build

# # # Expose the port Next.js runs on
# # EXPOSE 3000

# # # Start the app
# # CMD ["npm", "start"]



# # Use the official Node.js 18 image as a parent image
# FROM node:18-alpine

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies using production flag and cache
# RUN npm ci --production=false
# RUN npm install sharp
# RUN cp -r public .next/standalone/public

# # Copy the rest of your app's source code
# COPY . .

# # Set environment variables
# ENV NODE_ENV=production
# ENV IS_PRODUCTION_FRONTEND=true
# ENV IS_PRODUCTION_BACKEND=true



# # Build your Next.js app
# RUN npm run build

# # Expose the port Next.js runs on
# EXPOSE 3000

# # Start the app
# CMD ["node", ".next/standalone/server.js"]


# Use the official Node.js 18 image as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including sharp for image optimization
RUN npm ci --production=false
RUN npm install sharp

# Copy the rest of your app's source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV IS_PRODUCTION_FRONTEND=true
ENV IS_PRODUCTION_BACKEND=true
ENV PORT=8080

# Build your Next.js app
RUN npm run build

# Copy public directory to the standalone server
# RUN cp -r public .next/standalone/public

# Expose the port Next.js runs on
EXPOSE 8080

# Start the app using the standalone server
CMD ["node", ".next/standalone/server.js"]