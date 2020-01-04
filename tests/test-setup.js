import Vue from 'vue'
// import '../src/plugins/vuetify'
import vueI18n from '../src/plugins/i18n'
import '../src/plugins/vee-validate'
import fetchApiMock from "../src/bottle/fetchApi.mock";
import '../src/plugins/className'

global.fetchApiMock = fetchApiMock

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

global.login= function login(id){
    return container.fetchApi('test/login/'+id)
}

export {vueI18n, vuetify}
