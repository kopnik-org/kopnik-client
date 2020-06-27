/**
 * isomorphic-fetch должен импортнуться до intercept-fetch,
 * иначе тот подсунет свой базный полифил. Баг в том, что куки не приходят от сервера
 */
import isomorphicFetch from 'isomorphic-fetch'
// import '../src/register-error-handlers'

global.isomorphicFetch = isomorphicFetch
import expect from 'expect'
import Vue from 'vue'
import '../src/plugins/vue-the-mask'
import i18n from '../src/plugins/i18n'
import '../src/plugins/vee-validate'
import mapi from "../src/mapi";
import '../src/plugins/className'
import routerFactory from "../src/plugins/vue-router"
import toBeKopnikError from './toBeKopnikError'
global.mapi = mapi

// Vuetify внутри тестов импортируется по-иному чем в основной программе
import Vuetify from 'vuetify';
import ru from 'vuetify/es5/locale/ru'
import en from 'vuetify/es5/locale/en'
import {container} from "../src/bottle";

Vue.use(Vuetify)
let vuetify = new Vuetify({
    lang: {
        locales: {ru, en},
        current: 'ru',
    },
})

Vue.config.productionTip = false
Vue.config.devtools = false


global.login = function login(id) {
    return container.api('test/login/' + id)
}

const vuePlugins = {i18n, vuetify}
export default vuePlugins
export {i18n, vuetify, routerFactory}


expect.extend({
    toBeKopnikError
})
