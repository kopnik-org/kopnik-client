FROM node:latest
ARG NODE_OPTIONS=--openssl-legacy-provider


RUN git clone https://github.com/kopnik-org/kopnik-client app
WORKDIR /app

RUN npm install

# RUN ./node_modules/.bin/vue-cli-service build
RUN ./node_modules/.bin/vue-cli-service build

# удаляем папку с зависимостями
RUN rm -R ./node_modules

CMD [ "/bin/sh"]
