# Правила именования свойств
camelCase

# Свойства - объекты
Свойства, которые являются объектами, передаются иднтификатором объекта. Если поле null, то оно передается как null
```json
"witness_id":"8274",
"foreman_id":null
```
  
# Свойства - коллекции
Свойства, которые являются коллекциями, передаются null
```json
"ten": null
```  

# Ошибки
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
            "value": getInstancenstance"
            }, {
            "key": "fields",
            "value": "photo_50,city,verified"
            }, {
            "key": "name_case",
            "value": "Nom"
            }, {
            "key": "user_ids",
            "value": "210700286777"
            }, {
            "key": "v",
            "value": "5.103"
        }]
    }
}
```

# Получить нескольких пользовалетей
GET users/get?ids=210700286,7777777
status:2 можно не отправлять
```json
{
    "response": [{
        "id": 210700286,
        "lastName": "Stirling",
        "firstName": "Lindsey",
        "patronymic": "asdf",
        "nickname": "Boroda",
        "birthyear": "1900",
        "location": ["1234.3125","54.3245"], // latitude, longitude
        "photo": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
        "smallPhoto": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",

        "witness_id": "1234",
        "foreman_id": null,

        "ten": "undefined",
        "status": 1 // const STATUS_NEW= 0;  STATUS_PENDING= 1; STATUS_CONFIRMED= 2; STATUS_DECLINE= 3;
    },
    {
        "id": "7777777",
      ...
    }]
 }
 ```

# Получить пользователя по ВК uid
возвращает пустой response, если соответствующего пользователя в Копнике не заведено
GET users/getByUid?uid=210700286

```json
{
    "response": {
      "id": 1034853,
      "firstName": "fasdfasdf",
      ... элемент из ответа метода users/get()
    } 
 }
```

# Получить count самых старших пользователей в заданном квадрате в порядке возрастния ранга
GET users/get_top_inside_square?x1=123.123,y1=123.123,x2=1243.24,y2=53.23,count=20

Ответ аналогичный методу getInstance
