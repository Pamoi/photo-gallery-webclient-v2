FROM nginx:1.23.3

COPY nginx/default.conf /etc/nginx/conf.d/

COPY build/ /usr/share/nginx/html
