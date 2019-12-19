import Vue from 'vue'
import vuetify from './plugins/vuetify'
import router from './plugins/vue-router'
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

import Application from "./Application";
import App from './components/AppVue.vue'

global.app = new Application

Vue.config.productionTip = false

global.vue = new Vue({
    ...App,
    el: "#appContainer",
    vuetify,
    i18n,
    router,
    // render: h => h(App)
})//.$mount('#app')


