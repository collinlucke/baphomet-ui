FROM node:latest as build

# Declare buildt time environment variables
ARG NODE_ENV
ARG SERVER_BASE_URL

# Set environment variables
ENV NODE_ENV=$VITE_NODE_ENV
ENV SERVER_BASE_URL=$VITE_SERVER_BASE_URL

# Biuld App
WORKDIR /app
COPY package.json .
COPY .npmrc .npmrc
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