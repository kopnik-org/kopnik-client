import Vue from 'vue'
import App from './App.vue'
import Map from './components/Map'
import vuetify from './plugins/vuetify';
import i18n from './i18n'

import { Icon }  from 'leaflet'
import 'leaflet/dist/leaflet.css'

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


Vue.config.productionTip = false




new Vue({
    vuetify,
    i18n,
    render: h => h(App)
}).$mount('#app')

