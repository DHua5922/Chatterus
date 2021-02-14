# Source: https://dev.to/chrsgrrtt/dockerising-a-next-js-project-1ck5

# Extend from the official node image. 
FROM node:current-alpine AS base
WORKDIR /base
# Copy our package.json and install it. 
COPY package*.json ./
RUN npm install
# Add the working project files.
COPY . .

FROM base AS build
# Set the NODE_ENV to production.
ENV NODE_ENV=production
WORKDIR /build
# Copy the files from the base step.
COPY --from=base /base ./
# Run the build script specified in our package.json.
RUN npm run build

FROM node:current-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
# Copy our package.json.
COPY --from=build /build/package*.json ./
# Copy the .next directory, which contains our compiled app.
COPY --from=build /build/.next ./.next
# Copy the directory which contains our public assets across.
COPY --from=build /build/public ./public
# Finally, it installs the next package and 
# uses it to start our compiled app. 
RUN npm install next

# Expose compiled app at localhost:3000.
# The only files this final image contains 
# are the ones that we copied across - the 
# essentials - keeping it super lean.
EXPOSE 3000
CMD npm run start