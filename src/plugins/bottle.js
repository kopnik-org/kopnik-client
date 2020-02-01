import Bottle from "bottlejs"
import _ from "lodash"
import 'json-form-data'
import * as loglevel from "loglevel";

import Application from "../application/Application"
import config from '../../config'
import api from "../api";
import CookieService from "../bottle/CookieService"

Bottle.config.strict = true
const bottle = new Bottle()

bottle.service('cookieService', CookieService, 'config')
bottle.factory('api', function apiFactory(container) {
    return container.config.di.fetch ? api : global.mapi
})
bottle.factory('config', function configFactory() {
    if (!process.env.NODE_ENV) {
        throw new Error("NODE_ENV is not defined")
    }

    let local = {}//require("./local.js")
    let result = _.merge({}, config, local)[process.env.NODE_ENV]

    return result
})
if (!Application) {
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
 * @property {fetch} api
 * @property {CookieService} cookieService
 * @property {Object} config
 * @property {Object} config.api
 * @property {String} config.api.path
 * @property {Object} config.di
 * @property {Boolean} config.di.fetch
 * @property {Number} config.di.cookie
 * @property {Number} config.messenger.clientId
 * @property {String} config.messenger.loginUrl
 * @property {String} config.messenger.redirectUrl
 */
const container = bottle.container
export {bottle, container}
