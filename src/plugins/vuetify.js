import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import ru from 'vuetify/es5/locale/ru'
import en from 'vuetify/es5/locale/en'
import sk from 'vuetify/es5/locale/sk'
import pl from 'vuetify/es5/locale/pl'
import de from 'vuetify/es5/locale/de'
import cs from 'vuetify/es5/locale/cs'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: {
      ru,
      en,
      sk,
      pl,
      de,
      cs,
    },
    current: 'ru',
  },
})
