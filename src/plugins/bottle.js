import Bottle from "bottlejs"
import _ from "lodash"
import 'json-form-data'
import * as loglevel from "loglevel";
import LoglevelPluginPrefix from "loglevel-plugin-prefix"

import Application from "../Application"
import config from '../../config'
import {KopnikApiError} from "../KopnikError";
import LoglevelPluginToString from "./loglevel-plugin-to-string"

Bottle.config.strict = true
const bottle = new Bottle()

bottle.factory('defaultFetchApiOptions', function defaultFetchApiOptionsFactory(container) {
    let result = {}
    if (process.env.NODE_ENV == 'test') {
        result.headers = {
            Cookie: 'PHPSESSID=75dm4i3gah5gpqgjf5g6sjpq7k'
        }
    }
    return result
})
bottle.factory('fetchApi', function fetchApiFactory(container) {
    const config = container.config
    const defaultFetchApiOptions = container.defaultFetchApiOptions
    const logger = container.logger

    return async function fetchApi(url, options = {}) {
        const defaultOptions = {
            credentials: 'include',

            headers: {
                Accept: 'application/json',
                'Content-Type': !options.method || options.method.toUpperCase() == 'GET' ? 'text/plain' : 'application/x-www-form-urlencoded;charset=UTF-8',
            }
        }
        options = _.merge({}, defaultOptions, defaultFetchApiOptions, options)
        if (options.body && options.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') {
            options.body = jsonToFormData(options.body)
        }
        // logger.log(options)
        // console.log(options)
        let fullUrl = `${config.api.path}/${url}`

        let response
        try {
            response = await fetch(fullUrl, options)
            // Пропал 4G
        } catch (err) {

            throw new KopnikApiError(err.message, null, fullUrl)
        }
        // Не найдена страница или синтаксическая ошибка в веб-сервисе
        if (!response.ok) {
            throw new KopnikApiError(response.statusText, response.status, fullUrl)
        }

        let result
        switch (response.headers.get('Content-Type')) {
            case 'application/json':
                result = await response.json()
                // Не авторизован/Нет такого пользователя
                if (result.error) {
                    throw new KopnikApiError(result.error.error_msg, result.error.error_code, fullUrl)
                }
                break
            default:
                result = await response.text()
        }

        return result.response
    }
})
bottle.factory('config', function configFactory() {
    if (!process.env.NODE_ENV) {
        throw new Error("NODE_ENV is not defined");
    }

    let local = {}//require("./index.local.js")
    let result = _.merge({}, config, local)[process.env.NODE_ENV]

    return result
})
bottle.service('Application', Application, 'config')
bottle.factory('logger', function loggerFactory() {
    //все плагины ломают стектрейс консоли. то есть невозможно увидеть из какого файла и какой строки был вызван лог!
    // LoglevelPluginPrefix.reg(loglevel)
    // LoglevelPluginPrefix.apply(loglevel, {template: "%t [%l] %n: "})
    if (process.env.NODE_ENV == "test") {
        LoglevelPluginToString.apply(loglevel, {})
    }
// Be sure to call setLevel method in order to apply plugin
    loglevel.setLevel(loglevel.levels.DEBUG)
// loglevel.getLogger("StateManager").setLevel("info")
    return loglevel
})

/**
 * @callback fetch
 * @param {string} url
 * @param {Object} options
 */
/**
 * @type {Object}
 *
 * @property {loglevel} logger
 * @property {Application} Application
 * @property {Location} Location
 * @property {fetch} fetchApi
 * @property {Object} defaultFetchApiOptions
 */
const container = bottle.container
export {bottle, container}
