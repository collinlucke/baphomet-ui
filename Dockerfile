FROM node:latest as build

# Biuld App
WORKDIR /app
COPY package.json .
RUN npm install .
COPY . .
RUN npm run build

# Server with Nginx
FROM nginx:latest
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;"  ]