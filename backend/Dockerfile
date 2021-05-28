# This is for running the app in a docker container.
# Source: https://dev.to/rubiin/docker-pipeline-with-typescript-express-for-production-20kc

# this is the stage one , also know as the build step
FROM node:12.17.0-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

# this is stage two , where the app actually runs
FROM node:12.17.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 4000
CMD npm start