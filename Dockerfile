# # Use the official Node.js 18 image as a parent image
# FROM node:18-alpine

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies using production flag and cache
# RUN npm ci --production=false
# RUN npm install sharp

# # Copy the rest of your app's source code
# COPY . .

# # Set environment variables
# ENV NODE_ENV=production
# ENV IS_PRODUCTION_FRONTEND=true
# ENV IS_PRODUCTION_BACKEND=true

# # Build your Next.js app
# RUN npm run build

# RUN cp -R .next/static .next/standalone/.next/static
# RUN cp -R public .next/standalone/public

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

# Install dependencies using production flag and cache
RUN npm ci --production=false
RUN npm install sharp

# Copy the rest of your app's source code
COPY . .

# Set environment variables - ONLY PUBLIC URLS, NO SECRETS!
ENV NODE_ENV=production
ENV NEXT_PUBLIC_IS_PRODUCTION_FRONTEND=true
ENV NEXT_PUBLIC_IS_PRODUCTION_BACKEND=true
ENV NEXT_PUBLIC_BACKEND_BASE_URL=https://docgraphapi.up.railway.app
ENV NEXT_PUBLIC_BACKEND_API_URL=https://docgraphapi.up.railway.app/api/
ENV NEXT_PUBLIC_FRONTEND_BASE_URL=https://studygrapgh.co.uk/
ENV NEXT_PUBLIC_GATEWAY_URL=teal-ready-mouse-587.mypinata.cloud
ENV NEXT_PUBLIC_GOOGLE_CALLBACK_URL=https://studygrapgh.co.uk/api/auth/google/callback
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=1023093970842-latal9j95g6tgltj8rvtllepp4e8oe3g.apps.googleusercontent.com
ENV NEXT_PUBLIC_MICROSOFT_CALLBACK_URL=https://studygrapgh.co.uk/api/auth/microsoft/callback
ENV NEXT_PUBLIC_MICROSOFT_CLIENT_ID=be8e0c4d-ffc6-4ce7-a425-abdef5560c93


# Build your Next.js app
RUN npm run build

RUN cp -R .next/static .next/standalone/.next/static
RUN cp -R public .next/standalone/public

# Expose the port Next.js runs on
EXPOSE 3000


# Start the app
CMD node .next/standalone/server.js