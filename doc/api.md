## Аутентификация
В каждом запросе присутствуют куки от сервера, по которым Аутентифицируется пользователь.

## Авторизация
Все методы доступны только для аутентифицированных пользователей.

Исключение: ```users/get``` без параметров

Вид ошибки, когда неаутентифицированный пользователь запрашивает метод
```json
    "error": {
        "error_code": "not_authenticated",
        "error_msg": "Запрос не аутентифицирован",
        "request_params": [{
            "key": "...",
            "value": "121tgfsd"
            },
            ...
        }]
    }
}
```

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
"ten": null
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
        }]
    }
}
```


## GET users/get

Параметры: ```ids=210700286,7777777``` (необязательный)

Описание: Получить нескольких пользовалетей

Если параметр ```ids``` не задан. возвращает текущего пользователя или ```null```, если текущий пользователь не аутентифицировн.

Если ```status=2```, можно не включать поле ```status```
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
        "location": ["1234.3125","54.3245"], // latitude, longitude
        "photo": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
        "smallPhoto": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
        "status": 1, // const STATUS_NEW= 0;  STATUS_PENDING= 1; STATUS_CONFIRMED= 2; STATUS_DECLINE= 3;
        "witnessChatInviteLink": "vk.com/join........",
        "passport": 4726, // только для своего копника!!! 

        "witness_id": "1234",
        "foreman_id": null,

        "ten": "undefined",
    },
    {
        "id": "7777777",
      ...
    }]
 }
 ```

## GET users/getByUid? (пока авторизация на сервере, этот метод не нужен)
Параметры: uid=210700286

Описане: Получить пользователя по ВК uid 
возвращает ```response: null```, если соответствующего пользователя в Копнике не заведено

```json
{
    "response": {
      "id": 1034853,
      "firstName": "fasdfasdf",
      ... и т.д. все содержимое одного элемента из ответа users/get(ids)
    }
 }
```

## GET users/get_top_inside_square
Параметры: 

```x1=123.123,y1=123.123,x2=1243.24,y2=53.23``` координаты квадрата

```count=20``` кооличество возвращаемых копников

Опписание: Получить ```count``` самых старших пользователей в заданном квадрате в порядке возрастния ранга

Ответ аналогичный методу ```users/get```

## PUT users/putWitnessRequest

Описание: Оставить заявку на регистрацию
Если заявка от этого пользователя ВК уже есть, заменить ее этой

Тело:
```json
body:{
   "firstName": "sadgfd",
   "lastName": "jklsdfg89rfs",
   "patronymic": "sdfafasd",
   "birthyear": "1900",
   "passport": "1984",
   "nickname": "sdakljh23",
   "location": [1238974.12, 9124.12390],
    // "photo": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
    // "smallPhoto": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
}
``` 
Ответ:
```json
{
  "response": {
    // "id": 4589349085,       //идентификатор пользователя внутри Копника
    "witness_id": 03985202,  
    ... и т.д. все содержимое одного элемента из ответа users/get(ids)
  }
}
```
