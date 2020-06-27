/**
 * Created by alexey2baranov on 8/20/16.
 */
let constants = {
    "development": {
        messenger: {
            // идентификатор нашего приложения ВК
            // clientId: 7210289,
            // страница, на которую нужно перейти для аутентификации
            // loginUrl:'https://dev.kopnik.org/connect/vkontakte',
            loginUrl: 'http://localhost:8081/connect/vkontakte',
            // loginUrl: 'http://localhost:8082/connect/vkontakte'
        },
        api: {
            // path: "https://dev.kopnik.org/api"
            path: "http://localhost:8081/api"
            // path: "http://localhost:8082/api"
        },
        di: {
            fetch: true,
            cookie: false
        }
    },
    "test": {
        messenger: {
            // clientId: 7210289,
            loginUrl: 'http://localhost:8082/connect/vkontakte',
            // redirectUrl: 'http://localhost:8082/login/check-vk'
        },
        api: {
            path: "http://localhost:8082/api"
        },
        di: {
            fetch: false,
            cookie: true
        }
    },
    "production": {
        messenger: {
            loginUrl: 'https://dev.kopnik.org/connect/vkontakte',
            // clientId: 7210289,
            // redirectUrl: 'https://dev.kopnik.org/login/check-vk'
        },
        api: {
            path: "api"
        },
        di: {
            fetch: true,
            cookie: false
        }
    }
}

if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined")
}

let privateConstants = {}//require("./private")
let mergedConstants = require("lodash").merge({}, constants, privateConstants)[process.env.NODE_ENV]

export default constants
