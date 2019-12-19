import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify)

import ru from 'vuetify/es5/locale/ru'
import en from 'vuetify/es5/locale/en'


export default new Vuetify({
    lang: {
        locales: {ru, en},
        current: 'ru',
    },
})
