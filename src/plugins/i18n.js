import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import messages from "../locales/index";


/**
 * TODO: require.context is not a function внутри тестов
 */
// function loadLocaleMessages () {
//   const locales = require.context('../messages', true, /[A-Za-z0-9-_,\s]+\.json$/i)
//   const messages = {}
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i)
//     if (matched && matched.length > 1) {
//       const locale = matched[1]
//       messages[locale] = locales(key)
//     }
//   })
//   return messages
// }

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'ru',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'ru',
  messages //loadLocaleMessages()
})
