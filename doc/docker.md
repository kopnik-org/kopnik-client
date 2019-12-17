TODO:
Автозапуск сервисов
Конфик nginx (root папка)

Скачать образ

```scp root@95.181.198.66:/home/kopnik/dev.kopnik.org/kp-nginx-pgdb.tar ./```

Загрузить образ

```sudo docker load -i ./kp-nginx-pgdb.tar```

Запустить контейнер с образом

```sudo docker run -ti -p 8888:80 -v /home/alexey/WebstormProjects/kopnik-server:/home/kopnik/server kp-nginx-pgdb bash```

Стартануть Постгрес

```/etc/init.d/postgresql restart```

Стартануть nginx

```/etc/init.d/nginx restart```

Скопировать env

```cp .env .env.local```

Поменять в .env.local строку подключения

```DATABASE_URL=pgsql://kopnik:QazWsx0!@localhost:5432/kopnik_db```

Запустить composer

```composer install```

Запустить migration

```bin/console migrate```
