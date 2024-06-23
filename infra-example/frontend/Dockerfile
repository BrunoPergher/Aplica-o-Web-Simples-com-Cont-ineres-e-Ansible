FROM nginx:1.16.0-alpine

RUN ls

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80