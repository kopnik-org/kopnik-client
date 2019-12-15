import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify)

import ru from 'vuetify/es5/locale/ru'
import en from 'vuetify/es5/locale/en'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: {ru, en},
        current: 'ru',
    },
})
