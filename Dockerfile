FROM node:latest AS build

WORKDIR /app

ARG GIT_REGISTRY_TOKEN
ENV GIT_REGISTRY_TOKEN=${GIT_REGISTRY_TOKEN}

COPY package.json .
COPY index.html .
COPY tsconfig.json .
COPY src ./src
COPY scripts ./scripts
COPY public ./public

RUN echo "registry=https://registry.npmjs.org/" > .npmrc
RUN echo "@collinlucke:registry=https://npm.pkg.github.com" >> .npmrc
RUN echo "//npm.pkg.github.com/:_authToken=${GIT_REGISTRY_TOKEN}" >> .npmrc

RUN npm install -g pnpm typescript
RUN pnpm install
RUN pnpm build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
