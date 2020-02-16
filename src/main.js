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

global.application = container.application
global.application.authenticate()
/*    .then(() => {
        if (!this.user) {
            this.section = 'Map'
        } else if (this.user.status == Kopnik.Status.NEW || this.user.status == Kopnik.Status.DECLINED) {
            this.section = 'Profile'
        } else {
            this.section = 'Map'
        }
    })*/

global.vue = new Vue({
    ...AppVue,
    el: "#appContainer",
    vuetify,
    i18n,
    router: routerFactory(),
    // render: h => h(App)
})//.$mount('#app')
