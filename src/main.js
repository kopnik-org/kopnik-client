import Vue from 'vue'
import vuetify from './plugins/vuetify'
import routerFactory from './plugins/vue-router'
import i18n from './plugins/i18n'
import "./plugins/vee-validate"

import {Icon} from 'leaflet'
import 'leaflet/dist/leaflet.css'
// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

import AppVue from './components/AppVue.vue'
import {container} from "./bottle/bottle"
import './plugins/className'

Vue.config.productionTip = false

// error handling
window.addEventListener("error", function (event) {
    container.application.onerror(event.error)
})
window.addEventListener("unhandledrejection", function (event) {
    container.application.onerror(event.reason)
})
Vue.config.errorHandler = (err, vm, info) => {
    err.vm= vm
    err.info= info
    container.application.onerror(err)
}

global.application = container.application
global.application.authenticate()

global.vm = new Vue({
    ...AppVue,
    el: "#appContainer",
    vuetify,
    i18n,
    router: routerFactory(),
    // render: h => h(App)
})//.$mount('#app')
