/**
 * isomorphic-fetch должен импортнуться до intercept-fetch,
 * иначе тот подсунет свой базный полифил. Баг в том, что куки не приходят от сервера
 */
import isomorphicFetch from 'isomorphic-fetch'

global.isomorphicFetch = isomorphicFetch
import Vue from 'vue'
import i18n from '../src/plugins/i18n'
import '../src/plugins/vee-validate'
import mapi from "../src/mapi";
import '../src/plugins/className'
import routerFactory from "../src/plugins/vue-router"

global.mapi = mapi

// Vuetify внутри тестов импортируется по-иному чем в основной программе
import Vuetify from 'vuetify';
import ru from 'vuetify/es5/locale/ru'
import en from 'vuetify/es5/locale/en'
import {container} from "../src/plugins/bottle";

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
