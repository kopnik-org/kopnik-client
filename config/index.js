/**
 * Created by alexey2baranov on 8/20/16.
 */

let config = {
    "development": {
        messenger: {
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
    },
    "test": {
        messenger: {
            clientId: 7210289,
            redirectUrl: 'https://dev.kopnik.org/login/check-vk'
        },
        api: {
            path: "https://dev.kopnik.org/api"
        },
        di:{
            fetch: false,
            cookie: 2
        }
    },
    "production": {
        messenger: {
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
