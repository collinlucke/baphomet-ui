FROM node:latest as build

# Declare buildt time environment variables
ARG NODE_ENV
ARG SERVER_BASE_URL
ARG GIT_REGISTRY_TOKEN

# Set environment variables
ENV NODE_ENV=$VITE_NODE_ENV
ENV SERVER_BASE_URL=$VITE_SERVER_BASE_URL

# Biuld App
WORKDIR /app
COPY package.json .
RUN echo "registry=https://registry.npmjs.org/" > .npmrc
RUN echo "@collinlucke:registry=https://npm.pkg.github.com" >> .npmrc
RUN echo "//npm.pkg.github.com/:_authToken=${GIT_REGISTRY_TOKEN}" >> .npmrc
RUN npm install
COPY . .
RUN npm run build

# Server with Nginx
FROM nginx:latest
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;"  ]