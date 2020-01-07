/**
 * Created by alexey2baranov on 8/20/16.
 */

let config = {
    "development": {
        messenger: {
            clientId: 7210289,
            loginUrl:'https://dev.kopnik.org/connect/vkontakte',
            // loginUrl:'http://192.168.43.9:8081/connect/vkontakte',
            redirectUrl: 'https://dev.kopnik.org/login/check-vk'
            // redirectUrl: 'http://192.168.43.9:8081/login/check-vk'
        },
        api: {
            path: "https://dev.kopnik.org/api"
            // path: "http://192.168.43.9:8081/api"
        },
        di:{
            fetch: true,
            cookie: false
        }
    },
    "test": {
        messenger: {
            clientId: 7210289,
            loginUrl:'http://192.168.43.9:8082/connect/vkontakte',
            redirectUrl: 'http://192.168.43.9:8082/login/check-vk'
        },
        api: {
            path: "http://localhost:8082/api"
        },
        di:{
            fetch: false,
            cookie: true
        }
    },
    "production": {
        messenger: {
            loginUrl:'https://dev.kopnik.org/connect/vkontakte',
            clientId: 7210289,
            redirectUrl: 'https://dev.kopnik.org/login/check-vk'
        },
        api: {
            path: "https://dev.kopnik.org/api"
        },
        di:{
            fetch: true,
            cookie: false
        }
    }
}

if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined");
}

let privateConfig = {}//require("./private")
let mergedConfig = require("lodash").merge({}, config, privateConfig)[process.env.NODE_ENV]


export default config;
