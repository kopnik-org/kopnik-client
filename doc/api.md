## GET api/users/get(ids)

Получить нескольких пользовалетей. Если параметр ```ids``` не задан, будет подставлен идентификатор текущего пользователя из сессии.

__Параметры__
 
```ids=210700286,7777777``` идентификаторы пользователей (необязательный). 

__Ответ__
```json
{
    "response": [{
        "id": 210700286,
        "uid": 12454352,
        "lastName": "Stirling",
        "firstName": "Lindsey",
        "patronymic": "asdf",
        "nickname": "Boroda",
        "birthyear": "1900",
        "location": {"lat":14.3125, "lng": 54.3245},
        "photo": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
        "smallPhoto": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
        "status": 1, 
        "witnessChatInviteLink": "vk.com/join........",
        "passport": "0726",
        "locale": "ru",
        "role": 1,
        "witness_id": 1234,
        "foremanRequest_id": 5678,
        "foreman_id": null,
        "tenChatInviteLink": "https://vk.com/........ ссылка для перехода в чат десятки",
        "ten": "undefined"
    },
    {
        "id": "7777777",
        "...": ""
    }]
 }
 ```
Поле ```status``` имеет следующие значения: ```NEW= 0;  PENDING= 1; CONFIRMED= 2; DECLINE= 3;```


Поле ```role``` имеет следующие значения: ```KOPNIK= 1;  DANILOV_KOPNIK= 2; FUTURE_KOPNIK= 3; WOMEN= 4;```

Часть полей передаются только для своего копника и заверителя: ```passport```, ```locale```, ```witness_id```, ```witnessChatInviteLink```, ```foremanRequest_id```

Часть полей передаются только для своего копника и старшины: ``tenChatUrl``

## GET api/users/getEx

Получить расширенное состояние (вместе с загруженными коллекциями) текущего пользователя.

__Параметры__
 
__Ответ__
```json
{
    "response": {
        "id": 210700286,
        "lastName": "...",
        "...": "все поля из api/users/get ",

        "subordinates": "response из api/users/getSubordinates",
        "foremanRequests": "response из api/users/getForemanRequests",
        "witnessRequests": "response из api/users/getPending"
    }
 }
 ```

__Ошибки__

|Код      |Сообщение   |Описание
|---------|------------|--------
|1000+401              |Unauthorized | Пользователь не аутентифицирован

## GET api/users/getTopInsideSquare(x1, y1, x2, y2, count, maxRank)
Получить ```count``` самых старших пользователей в заданном квадрате в порядке убывания ранга (только заверенные пользователи)

__Параметры__

```x1=123.123,y1=123.123,x2=1243.24,y2=53.23``` координаты квадрата

```count=20``` кооличество возвращаемых копников

```maxRank=100000``` Выбирать среди копнико ранг которых не превышает


__Ошибки__

|Код   |Сообщение   |Описание
|------|------------|--------
|401              |Unauthorized | Пользователь не аутентифицирован

__Ответ__
 
 аналогичен методу ```users/get```

## POST api/users/updateProfile

Обновить своего (текущего) пользователя. Меняет статус пользователя на ОЖИДАЕТ ЗАВЕРЕНИЯ.

__Параметры__
```json 
{
    "firstName": "sadgfd",
    "lastName": "jklsdfg89rfs",
    "patronymic": "sdfafasd",
    "birthyear": 1900,
    "passport": "1984",
    "nickname": "sdakljh23",
    "location": {"lat": 14.12, "lng": 124.12390},
    "locale": "ru",
    "role": 1
}
```
__Ошибки__

|Код   |Сообщение   |Описание
|------|------------|--------
|510              |Message From Group Not Allowed  |Сообщения от группы не разрешены
|1000000+VK_ERROR |VK Error <VK_ERROR>             |Ошибка ВК во время отправки сообщения https://vk.com/dev/messages.send

__Ответ__
```json
{
    "response": {
        "witness_id": 3985202
    }
}
```

## GET api/users/getPending

Получить заявки на регистрацию, которые должен заверять текущий пользователь.

__Ошибки__

|Код   |Сообщение   |Описание
|------|------------|--------
|401              |Unauthorized | Пользователь не аутентифицирован

__Ответ__

аналогичен методу ```users/get(ids)``` 
с добавлением поля ```passport``` последние 4 цифры поспорта

## POST api/users/updatePending

Подтвердить/отклонить заявку на регистрацию.

__Параметры__

```json
{
    "id": 21,
    "status": 2
}
```

__Ошибки__

|Код   |Сообщение   |Описание
|------|------------|--------
|401              |Unauthorized | Пользователь не аутентифицирован
|5              |Pending user not found | Пользователя с таким идентификатором среди заверяемых текущим пользователем не найдено

Pending user not found

__Ответ__

```json
{
    "response": true
}
```

## POST api/users/updateLocale

Поменять локаль пользователя.

__Параметры__
 
 ```json 
{
    "locale": "ru"
}
```

__Ответ__
```json
{
  "response": true
}
```

## GET api/users/isMessagesFromGroupAllowed

Возможность отрпавки сообщений пользователю

__Ответ__
```json
{
  "response": true
}
```

## POST api/users/updateLocale

Обновляет локаль текущего пользователя. Доступен для всех участников, включая новых, незаверенных, отклоненных и прочих.

__Параметры__
```json 
{
    "locale": "ru"
}
```

__Ошибки__

|Код   |Сообщение   |Описание
|------|------------|--------
|401              |Unauthorized | Пользователь не аутентифицирован

__Ответ__
```json
{
    "response": null
}
```
