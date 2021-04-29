import Vue from 'vue'
import i18next from 'i18next'
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import i18nextHttpBackend from 'i18next-http-backend'

import VueI18Next from "@panter/vue-i18next";
// import VueParams from 'vue-params'

import messages from "../locales/index"


/* initial setup */
// Vue.use(VueParams)
Vue.use(VueI18Next)
// Vue.params.i18nextLanguage = "ru"


i18next
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: 'ru',
    debug: true,
    ns: ['main'],
    defaultNS: 'main',
    // nonExplicitSupportedLngs: true,
    // initImmediate: false,
    backend: {
      loadPath: 'https://raw.githubusercontent.com/kopnik-org/kopnik-client/main/src/locales/{{lng}}/{{ns}}.json',
      crossDomain: true
    }
  }, function (err, t) {
    // console.log('initialized', i18next.language, i18next.languages)
    console.log(i18next.t('main:drawer.profile'))
  })

i18next.on('languageChanged', () => {
  try {
    console.log(arguments[1].default.language)
    console.log(i18next.t('main:drawer.profile'))
  } catch (err) {

  }
})


const i18n = new VueI18Next(i18next)


export default i18n
