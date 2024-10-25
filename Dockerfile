FROM node:latest as build

ARG NODE_ENV
ARG SERVER_BASE_URL
ARG GIT_REGISTRY_TOKEN

ENV NODE_ENV=${NODE_ENV}
ENV SERVER_BASE_URL=${SERVER_BASE_URL}
ENV GIT_REGISTRY_TOKEN=${GIT_REGISTRY_TOKEN}

WORKDIR /app
COPY package.json .
COPY preinstall.js .
COPY link-package.js .
COPY .env .
COPY .npmrc .

RUN npm install -g pnpm
RUN pnpm install
RUN node preinstall.js
RUN pnpm run build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
