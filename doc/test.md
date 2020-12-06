## GET api/test/login(id)

Аутентифицировать как пользователя

__Параметры__
 
```id=1``` идентификатор пользователя 

__Ответ__

|Заголовок   |Значение                              |Описание
|------------|--------------------------------------|--------
|set-cookie  |PHPSESSID=435h3jk5h35lh4k2jbl43kh53kj | Куки пользователя


## GET api/test/setupDB

Сбросить базу данных на начальное состояние

__Ответ__
```json
{
  "response": "output from console"
}
```

## GET test/createUser

Создать пользователя в БД. Только для тестового окружения для тестовых целей.

__Параметры__
 
```json
{
      "lastName": "11:19:27 PM",
      "firstName": "11:19:27 PM",
      "patronymic": "11:19:27 PM",
      "nickname": "11:19:27 PM",
      "birthyear":"2020",
      "passport": "0123",
      "location":{ "lat": 30, "lng": 50 },
      "photo":"photo/11:19:27 PM",
      "smallPhoto":"smallPhoto/11:19:27 PM",
      "status":"0",
      "locale":"ru",
      "role":1,
      "rank":1,
      "identifier":1607113167778778,
      "email":"1607113167778778@kopnik.ru",
      "access_token":"access_token1607113167778778"
    }
```

__Ответ__
```json
{
    "response": {
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

        "ten": "undefined"
    }
 }
 ```
