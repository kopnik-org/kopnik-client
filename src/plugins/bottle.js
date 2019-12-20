import Bottle from "bottlejs"
import _ from "lodash"
import 'json-form-data'
import * as loglevel from "loglevel";

import Application from "../Application"
import config from '../../config'
import fetchApi from "../bottle/fetchApi";
import fetchApiMock from "../bottle/fetchApi.mock";

Bottle.config.strict = true
const bottle = new Bottle()

/**
 * Настраивает контейнер
 * Для тестов необходим сброс и перенастройка чтобы соблюсти изолированность тестов
 *
 * @param {Object} options параметры по умолчанию соответствуют наиболее приемлемым для окружения значениям окружению
 * @param {Number=} options.cookie
 * @param {Boolean=} options.fetch
 */
Bottle.prototype.setup = function (options) {
    bottle.factory('defaultFetchApiOptions', function defaultFetchApiOptionsFactory(container) {
        const cookies = {
            1: 'PHPSESSID=user-1',
            2: 'PHPSESSID=eqlae6a1grpvcirpemfvebf806',
            3: 'PHPSESSID=user-3',
            4: 'PHPSESSID=user-4',
            5: 'PHPSESSID=user-5',
            6: 'PHPSESSID=user-6',
            7: 'PHPSESSID=user-7',
            8: 'PHPSESSID=user-8',
            9: 'PHPSESSID=user-9',
            10: 'PHPSESSID=user-10',
        }
        const result = {}
        if (container.config.di.cookie) {
            result.headers = {
                cookie: cookies[container.config.di.cookie]
            }
        }
        // console.log(result)
        return result
    })
    bottle.factory('fetchApi', function fetchApiFactory(container) {
        return container.config.di.fetch ? fetchApi : fetchApiMock
    })
    bottle.factory('config', function configFactory() {
        if (!process.env.NODE_ENV) {
            throw new Error("NODE_ENV is not defined");
        }

        let local = {}//require("./local.js")
        let result = _.merge({}, config, local)[process.env.NODE_ENV]

        return result
    })
    if (!Application){
        throw new Error("Application is undefined in bottle")
    }
    bottle.service('application', Application, 'logger')
    bottle.factory('logger', function loggerFactory() {
        //все плагины ломают стектрейс консоли. то есть невозможно увидеть из какого файла и какой строки был вызван лог!
        // LoglevelPluginPrefix.reg(loglevel)
        // LoglevelPluginPrefix.apply(loglevel, {template: "%t [%l] %n: "})
        loglevel.setLevel(loglevel.levels.DEBUG)
        if (process.env.NODE_ENV == "test") {
            loglevel.setLevel(loglevel.levels.WARN)
            // LoglevelPluginToString.apply(loglevel, {})
        }
// Be sure to call setLevel method in order to apply plugin
// loglevel.getLogger("StateManager").setLevel("info")
        return loglevel
    })
    Object.assign(this.container.config.di, options)
}

bottle.setup()

/**
 * @callback fetch
 * @param {string} url
 * @param {Object} options
 */
/**
 * @type {Object}
 *
 * @property {loglevel} logger
 * @property {Application} application
 * @property {Location} Location
 * @property {fetch} fetchApi
 * @property {Object} defaultFetchApiOptions
 * @property {Object} defaultFetchApiOptions.headers
 * @property {Object} defaultFetchApiOptions.headers.cookie
 * @property {Object} config
 */
const container = bottle.container
export {bottle, container}
