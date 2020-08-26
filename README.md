# kopnik-client

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run tests

```
npm test
```

Перед запуском тестов убедитесь, что запущен тестовая сборка (сервер приложений + база данных)

```
cd <server-project-folder>
make test-full-up
```


##Docker

### Выложить образ на DockerHub

```bash
# собрать образ
npm run docker:build

# выложить образ на DockerHub
npm run docker:push
```

## Развернуть на сервере

https://hub.docker.com/repository/docker/kopnikorg/kopnik-client-staging

```
# Склонировать репозиторий в любую папку 
git clone https://github.com/kopnik-org/kopnik-client

# перейти в папку 
cd kopnik-client

# запустить клиента на порту :8050
make up

# погасить клиента
make down
``` 
