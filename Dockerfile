FROM nginx:1.17.1-alpine
COPY nginx-custom.conf /etc/nginx/nginx.conf
COPY /dist/fluxo-caixa-app /usr/share/nginx/html