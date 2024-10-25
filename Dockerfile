FROM node:latest as build

ARG NODE_ENV
ARG SERVER_BASE_URL
ARG GIT_REGISTRY_TOKEN

ENV NODE_ENV=${NODE_ENV}
ENV SERVER_BASE_URL=${SERVER_BASE_URL}
ENV GIT_REGISTRY_TOKEN=${GIT_REGISTRY_TOKEN}

WORKDIR /app
COPY package.json .
COPY set-dependency.js .
COPY link-package.js .

RUN echo "registry=https://registry.npmjs.org/" > .npmrc
RUN echo "@collinlucke:registry=https://npm.pkg.github.com" >> .npmrc
RUN echo "//npm.pkg.github.com/:_authToken=${secretsGIT_REGISTRY_TOKEN}" >> .npmrc

RUN npm install -g pnpm
RUN pnpm install
RUN node set-dependency.js
RUN pnpm run build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
