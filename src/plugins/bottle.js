import Bottle from "bottlejs"
import _ from "lodash"
import 'json-form-data'
import * as loglevel from "loglevel";
import LoglevelPluginPrefix from "loglevel-plugin-prefix"

import Application from "../Application"
import config from '../../config'
import {KopnikApiError} from "../KopnikError";
import LoglevelPluginToString from "./loglevel-plugin-to-string"
import prefix from "loglevel-plugin-prefix";


Bottle.config.strict = true
const bottle = new Bottle()

bottle.factory('Config', function configFactory(){
    if (!process.env.NODE_ENV) {
        throw new Error("NODE_ENV is not defined");
    }

    let local = {}//require("./index.local.js")
    let result = _.merge({}, config, local)[process.env.NODE_ENV]

    return result
})
bottle.service(Application.name, Application, 'Config')
bottle.factory('API', function apiFactory(container){
    const config = container.Config

    return async function api(url, options={}) {
        const defaultOptions = {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': !options.method || options.method.toUpperCase() == 'GET' ? 'text/plain' : 'application/x-www-form-urlencoded;charset=UTF-8',
            }
        }
        options = _.merge(defaultOptions, options)
        if (options.body){
            options.body= jsonToFormData(options.body)
        }

        let fullUrl = `${config.api.path}/${url}`

        let response
        try {
            response = await fetch(fullUrl, options)
        // Пропал 4G
        } catch (err) {
            throw new KopnikApiError(err.message, null, fullUrl)
        }
        // Не найдет веб-сервис или синтаксическая ошибка в веб-сервисе
        if (!response.ok) {
            throw new KopnikApiError(response.statusText, response.status, fullUrl)
        }
        // Не авторизован/Нет такого пользователя
        if (response.error){
            throw new KopnikApiError(response.error.error_msg, response.error.error_code, fullUrl)
        }
    }
})
bottle.factory('Log', function logFactory(){
    LoglevelPluginPrefix.reg(loglevel)
    LoglevelPluginPrefix.apply(loglevel, {template:"%t [%l] %n: "})
    if (process.env.NODE_ENV=="testing") {
        LoglevelPluginToString.apply(loglevel, {})
    }
// Be sure to call setLevel method in order to apply plugin
    loglevel.setLevel(loglevel.levels.DEBUG)
// loglevel.getLogger("StateManager").setLevel("info")

    export default loglevel


})

/**
 * @type {Object}
 *
 * @property {Object} container
 * @property {Application} container.Application
 * @property {Location} container.Location
 * @property {Promise} container.API
 */
const typedBottle= bottle
export default typedBottle

// bottle.container.
