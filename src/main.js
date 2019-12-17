import * as models from "./models"

import Vue from 'vue'
import App from './components/App.vue'
import Map from './components/Map'
import vuetify from './plugins/vuetify'
import router from './plugins/vue-router'


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
import "./plugins/loglevel"
import * as logger from 'loglevel'

import "./plugins/vee-validate"
import Profile from "./components/Profile";
import Witness from "./components/Witness";


console.log('global app ')
global.app = new Application



    Vue.config.productionTip = false

    global.vue= new Vue({
        ...App,
        el: "#appContainer",
        vuetify,
        i18n,
        router,
        // render: h => h(App)
    })//.$mount('#app')


