/**
 * isomorphic-fetch должен импортнуться до intercept-fetch,
 * иначе тот подсунет свой базный полифил. Баг в том, что куки не приходят от сервера
 */
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()
fetchMock.dontMock()
// import isomorphicFetch from 'isomorphic-fetch'
// import '../src/register-error-handlers'

// global.isomorphicFetch = isomorphicFetch
import expect from 'expect'
import Vue from 'vue'
import '../src/plugins/vue-the-mask'
import i18n from '../src/plugins/i18n'
import '../src/plugins/vee-validate'
import '../src/plugins/className'
import routerFactory from "../src/plugins/vue-router"
import toBeKopnikError from './toBeKopnikError'
import '../src/plugins/vue-promise-button'

// Vuetify внутри тестов импортируется по-иному чем в основной программе
import Vuetify from 'vuetify';
import ru from 'vuetify/es5/locale/ru'
import en from 'vuetify/es5/locale/en'
import {container} from "../src/bottle/bottle";
import fetchMockIf from "@/mapi/fetchMockIf";

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



fetch.mockIfEx=fetchMockIf
