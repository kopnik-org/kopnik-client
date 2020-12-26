FROM node:latest

RUN git clone https://github.com/kopnik-org/kopnik-client app
WORKDIR /app

RUN npm install

# RUN ./node_modules/.bin/vue-cli-service build
RUN ./node_modules/.bin/vue-cli-service build --mode staging

# удаляем папку с зависимостями
RUN rm -R ./node_modules

CMD [ "/bin/sh"]
