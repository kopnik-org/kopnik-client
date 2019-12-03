import * as models from "./models"

import Vue from 'vue'
import App from './components/App.vue'
import Map from './components/Map'
import vuetify from './plugins/vuetify';
import i18n from './i18n'

import { Icon }  from 'leaflet'
import 'leaflet/dist/leaflet.css'

import Application from "./Application";
import log from "./log"

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.config.productionTip = false

let app= new Application
app.user= models.Kopnik.getReference(1)
app.user.merge({
    firstname: "Барада",
    surnaname: "Барада",
    patronymic: "Барада",
    birthday: "Барада",
    passport: "Барада",
    location:undefined,
    nick: "Барада",
})


new Vue({
    ...App,
    el: "#app",
    app,
    vuetify,
    i18n,
    // render: h => h(App)
})//.$mount('#app')

