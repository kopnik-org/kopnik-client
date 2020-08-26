FROM node:14.8.0-alpine

# создание директории приложения
WORKDIR /usr/src/app

# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности
# скопировать оба файла: package.json и package-lock.json
COPY package*.json ./

RUN npm install
# Если вы создаете сборку для продакшн
# RUN npm ci --only=production

# копируем исходный код
COPY . .

# собираем из исходного кода дистрибутив
RUN npm run build:staging

# удаляем папку с зависимостями
RUN rm -R ./node_modules

CMD [ "/bin/sh" ]
