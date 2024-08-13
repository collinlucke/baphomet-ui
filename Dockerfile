FROM node:latest as build

# Biuld App
WORKDIR /app
RUN pnpm install
COPY . .
RUN pnpm run build

# Server with Nginx
FROM nginx:latest
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;"  ]