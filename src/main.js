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



Vue.config.productionTip = false

let app = new Application
app.user = models.Kopnik.getReference(1)

new Vue({
    ...App,
    el: "#app",
    app,
    vuetify,
    i18n,
    // render: h => h(App)
})//.$mount('#app')

