# Use an official Node.js LTS image as a base image
FROM node:21 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN yan install

# Copy the rest of the application files
COPY . .

# Build the TypeScript application
RUN npm run build

# Use a lightweight production image
# FROM node:21 AS production

# Set the working directory
# WORKDIR /app

# Copy only the necessary files from the builder stage
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./

ENV DATABASE_URL=mongodb://root:root@localhost:27017/chatApp?authSource=admin
ENV JWT_SECRET=sdkjkug979g439g479^#
ENV COOKIE_EXPIRE=15
# Expose the port that the app will run on
EXPOSE 4000

# Start the application using nodemon
CMD ["node", "dist/app"]