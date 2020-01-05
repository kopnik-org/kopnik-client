## Аутентификация
В каждом запросе присутствуют куки от сервера, по которым Аутентифицируется пользователь.

## Авторизация
Все методы доступны только для аутентифицированных пользователей.

Исключение: ```users/get``` без параметров

## Правила именования свойств
camelCase - скалярные свойства и свойства-коллекции

camelCase_id - объектные свойства

## Свойства - объекты
Свойства, которые являются объектами, передаются иднтификатором объекта. Если поле null, то оно передается как null
```json
{
    "witness_id":"8274",
    "foreman_id":null
}
```
  
## Свойства - коллекции
Свойства, которые являются коллекциями, передаются null
```json
{
    "ten": null
}
```  

## Ошибки
HTTP status code: 200 (как у всех успешных запросов)
```json
{
    "error": {
        "error_code": 113,
        "error_msg": "Invalid user id",
        "request_params": [{
            "key": "oauth",
            "value": "1"
            }, {
            "key": "method",
            "value": "getInstancenstance"
            }
        ]
    }
}
```


## GET users/get(ids)

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
        "location": {"lat:"14.3125, "lng": 54.3245}
        "photo": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
        "smallPhoto": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
        "status": 1, 
        "witnessChatInviteLink": "vk.com/join........",
        "passport": 4726,
        "locale": "ru",

        "witness_id": "1234",
        "foreman_id": null,

        "ten": "undefined",
    },
    {
        "id": "7777777",
        "...": ""
    }]
 }
 ```
Поле ```status``` имеет следующие значения: ```STATUS_NEW= 0;  STATUS_PENDING= 1; STATUS_CONFIRMED= 2; STATUS_DECLINE= 3;```

Часть полей передаются только для своего копника: ```passport```, ```locale```, ```witness_id```, ```witnessChatInviteLink```

## GET users/getByUid? (пока авторизация на сервере, этот метод не нужен)
Получить пользователя по ВК uid. 
Возвращает ```response: null```, если соответствующего пользователя в Копнике не заведено.

__Параметры__
 
```uid=210700286```

__Ответ__
```json
{
    "response": {
      "id": 1034853,
      "firstName": "fasdfasdf",
      "...": "и т.д. все содержимое одного элемента из ответа users/get(ids)"
    }
 }
```

## GET users/getTopInsideSquare(x1, y1, x2, y2)
Получить ```count``` самых старших пользователей в заданном квадрате в порядке возрастния ранга.

__Параметры__
```x1=123.123,y1=123.123,x2=1243.24,y2=53.23``` координаты квадрата

```count=20``` кооличество возвращаемых копников

__Ответ__
 
 аналогичен методу ```users/get```

## POST users/update

Обновить своего (текущего) пользователя. Меняет статус пользователя на ОЖИДАЕТ ЗАВЕРЕНИЯ.

__Параметры__
```code
   "firstName": "sadgfd",
   "lastName": "jklsdfg89rfs",
   "patronymic": "sdfafasd",
   "birthyear": "1900",
   "passport": "1984",
   "nickname": "sdakljh23",
   "location": [1238974.12, 9124.12390],
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
        "witness_id": 03985202
    }
}
```

## GET users/getWitnessRequests

Получить заявки на регистрацию, которые должен заверять текущий пользователь.

__Ответ__

аналогичен методу ```users/get(ids)``` 
с добавлением поля ```passport``` последние 4 цифры поспорта

## POST users/patchWitnessRequest

Подтвердить заявку на регистрацию.

__Параметры__

```id=21``` идентификатор заявки

```status=2``` новое состояние заявки

__Ответ__
```json
{
    "response": true
}
```

## POST users/patchLocale

Поменять локаль пользователя.

__Параметры__
 
 ```locale=ru``` новая локаль

__Ответ__
```json
{
  "response": true
}
```
