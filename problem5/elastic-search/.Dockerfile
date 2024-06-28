FROM node:20-alpine as build-stage
WORKDIR /usr
COPY accounts.json ./