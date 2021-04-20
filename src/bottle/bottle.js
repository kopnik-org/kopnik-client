import Bottle from "bottlejs"
import _ from "lodash"
// import 'json-form-data'
import * as loglevel from "loglevel";
import ClientOAuth2 from "client-oauth2"

import Application from "../application/Application"
import constants from './constants'
import api from "../api";
import CookieService from "./CookieService"
import MK from "../mk/mk";
import LocaleManager from "../locales/LocaleManager";
import messages from "@/locales";

Bottle.config.strict = true
const bottle = new Bottle()

bottle.factory('logger', function loggerFactory() {
  //все плагины ломают стектрейс консоли. то есть невозможно увидеть из какого файла и какой строки был вызван лог!
  // LoglevelPluginPrefix.reg(loglevel)
  // LoglevelPluginPrefix.apply(loglevel, {template: "%t [%l] %n: "})
  loglevel.setLevel(loglevel.levels.DEBUG)
  if (process.env.NODE_ENV == "test") {
    loglevel.setLevel(loglevel.levels.DEBUG)
    // LoglevelPluginToString.apply(loglevel, {})
  }
// Be sure to call setLevel method in order to apply plugin
// loglevel.getLogger("StateManager").setLevel("info")
  return loglevel
})

bottle.constant('messages', messages)

bottle.factory('env', function env() {
  return process.env.NODE_ENV || 'development'
})
bottle.service('localeManager', function localeManager() {
  const localeManager = new LocaleManager()
  localeManager.currentLocale = 'ru'//container.env === 'development' ? 'en' : 'ru'
  return localeManager
})
bottle.service('cookieService', CookieService, 'constants')
bottle.factory('api', function apiFactory(container) {
  // if (!container.constants.di.fetch) {
  // return mapi
  // }
  return api
})
bottle.factory('VK', function vkFactory(container) {
  if (process.env.NODE_ENV === 'test') {
    return MK
  } else if (global.VK) {
    return global.VK
  } else {
    throw new Error("VK is not available. The employer or internet service provider may have restricted access to the site.")
  }
})
bottle.factory('constants', function constantsFactory() {
  if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined")
  }

  let local = {}//require("./local.js")
  let result = _.merge({}, constants, local)[process.env.VUE_APP_MODE || process.env.NODE_ENV]

  return result
})
if (!Application) {
  throw new Error("Application is undefined in bottle")
}
bottle.service('application', Application, 'logger')

/**
 * @callback fetch
 * @param {string} url
 * @param {Object?} options
 */
/**
 * @type {Object}
 * @property {VKClient} vkClient
 * @property {loglevel} logger
 * @property {Application} application
 * @property {Location} Location
 * @property {Function} api
 * @property {MK.class} VK
 * @property {CookieService} cookieService
 * @property {Object} constants
 * @property {Object} constants.api
 * @property {String} constants.api.path
 * @property {Object} constants.di
 * @property {Boolean} constants.di.fetch
 * @property {Number} constants.di.cookie
 * @property {Number} constants.messenger.clientId
 * @property {String} constants.messenger.loginUrl
 * @property {String} constants.messenger.redirectUrl
 * @property {String} constants.sw
 * @property {String} constants.sw.delay
 * @property {LocaleManager} localeManager
 * @property {string} env
 * @property {{ru, en, sk}} messages
 */
const container = bottle.container
export {bottle, container}
