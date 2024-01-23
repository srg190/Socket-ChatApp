# Get the base image
FROM node:21-alpine3.18 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


# Use an official Node.js LTS image as a base image

