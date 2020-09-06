## Аутентификация
В каждом запросе присутствуют куки от сервера, по которым Аутентифицируется пользователь.

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
        "error_file": "/app/tests/Controller/DefaultController.php",
        "error_line": 253,
        "error_trace": [
        {
          "file": "/app/vendor/symfony/http-kernel/HttpKernel.php",
          "line": 157,
          "function": "bodyError",
          "class": "App\\Tests\\Controller\\DefaultController",
          "type": "->",
          "args": [
            {
              "attributes": {},
              "request": {}
            }
          ]
        }
        ],
        "request_params": [{
            "key": "oauth",
            "value": "1"
            }, 
            {
            "key": "method",
            "value": "getInstancenstance"
            },
            "..."
        ]
    }
}
```
