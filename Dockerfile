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
COPY .npmrc .

RUN npm install -g pnpm typescript
RUN pnpm install
RUN pnpm build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *

RUN apk update \
    && apk add openssl
COPY fullchain.pem /etc/ssl/certs
COPY privkey.pem /etc/ssl/private
RUN openssl rsa -in /etc/ssl/private/privkey.pem -out /etc/ssl/private/privkey.pem -passin pass:ExportSSL4me!
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
