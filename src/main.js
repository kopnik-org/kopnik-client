import * as models from "./models"

import Vue from 'vue'
import App from './components/App.vue'
import Map from './components/Map'
import vuetify from './plugins/vuetify';

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
import i18n from './plugins/i18n'
import log from "./log"
import "./plugins/vee-validate"



(async function() {
    Vue.config.productionTip = false

    global.vue= new Vue({
        ...App,
        el: "#appContainer",
        vuetify,
        i18n,
        // render: h => h(App)
    })//.$mount('#app')
})()

