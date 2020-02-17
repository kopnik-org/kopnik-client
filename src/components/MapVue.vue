<template>
    <LMap ref="map" :center="center" :zoom="zoom" :options="{zoomControl: zoomControl}"
          @click="lmap_click"
          @ready="lmap_ready"
          @zoomstart="lmap_zoomstart"
          @movestart="lmap_movestart"
          @update:bounds="lmap_updateBounds"
          @update:center="lmap_updateCenter"
          @update:zoom="lmap_updateZoom"

          style="z-index: 0">
        <!--        <l-control-zoom position="left"  ></l-control-zoom>-->
        <l-tile-layer
                v-for="tileProvider in tileProviders"
                :key="tileProvider.name"
                :name="tileProvider.name"
                :visible="tileProvider.visible"
                :url="tileProvider.url"
                :attribution="tileProvider.attribution"
                :token="tileProvider.token"
                layer-type="base"/>
        <v-geosearch v-if="geosearch" :options="geosearchOptions"></v-geosearch>
<!--        <l-control-layers v-if="layersControl" position="topleft"></l-control-layers>-->
        <l-control-scale v-if="scaleControl" position="bottomright" :imperial="false" :metric="true"></l-control-scale>
        <v-locatecontrol v-if="locateControl" :options="locateOptions"></v-locatecontrol>
        <slot></slot>
    </LMap>
</template>
<script>
    import {OpenStreetMapProvider} from 'leaflet-geosearch';
    import _ from 'lodash'

    import {
        LControlScale,
        LMap,
        LTileLayer,
        LControlLayers,
    } from 'vue2-leaflet'
    import VGeosearch from 'vue2-leaflet-geosearch';
    import VLocatecontrol from 'vue2-leaflet-locatecontrol/Vue2LeafletLocatecontrol'
    import {container} from "../bottle/bottle";
    import logger from "./mixin/logger";

    export default {
        mixins: [logger],
        name: 'MapVue',
        components: {
            VGeosearch,
            LMap,
            LTileLayer,
            LControlLayers,
            LControlScale,
            VLocatecontrol
        },
        data() {
            return {
                application: container.application,
                locateOptions: {
                    position: 'bottomright',
                    drawCircle: false,
                    drawMarker: false,
                    keepCurrentZoomLevel: true,
                    // enableHighAccuracy: true,
                    flyTo: true,
                    strings: {
                        title: "Определить мое местоположение"
                    }
                },
                geosearchOptions: {
                    provider: new OpenStreetMapProvider(),           // required
                    style: this.geosearch || 'bar',
                    showMarker: false,
                    keepResult: false
                },
                tileProvider1: {
                    name: "OpenStreetMap",
                    visible: true,
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
                    token: null
                },
                tileProvider2: {
                    name: "Dark",
                    visible: false,
                    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: "abcd",
                    token: null
                },
                tileProvider3: {
                    name: "GIScience",
                    visible: false,
                    url: "https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png",
                    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    subdomains: "abcd",
                    token: null
                },
            }
        },
        props: {
            center: {
                type: [Array,Object],
            },
            zoom: {
                type: Number,
                // default: 14
            },
            storageKey: {
                type: String
            },
            //bar|button
            geosearch: {
                type: String
            },
            zoomControl: {
                // type: Boolean,
                // default: true
            },
            layersControl: {
                // type: [Boolean,Object],
                // default: true
            },
            locateControl: {
                // type: [Boolean,Object],
                // default: true
            },
            scaleControl: {}
        },
        watch: {
            'tileProvider1.visible':

                function () {
                    console.log("tile1 changed")
                }
        },
        computed: {
            tileProviders() {
                return [this.tileProvider1, this.tileProvider2, this.tileProvider3]
            }
        },
        methods: {
            map_dblclick(event) {
                alert(event)
            },
            lmap_ready(event) {
                this.$emit('ready', event)
            },
            lmap_click(event) {
                this.$emit('click', event)
            },
            lmap_zoomstart(event) {
                this.$emit('zoomstart', event)
            },
            lmap_movestart(event) {
                this.$emit('movestart', event)
            },
            onLocationClick() {
                alert("getInstance current location")
            },
            lmap_updateBounds(event) {
                // фиксим ошибку vue-leaflet, который выбрасывает два события подряд
                if (this._prevBounds && _.isEqual(this._prevBounds, event)) {
                    return
                }
                this.$emit('update:bounds', event)
                this._prevBounds = event
            },
            lmap_updateCenter(event) {
                // фиксим ошибку vue-leaflet, который выбрасывает два события подряд
                if (this._prevCenter && _.isEqual(this._prevCenter, event)) {
                    return
                }
                this.$emit('update:center', event)
                this._prevCenter = event
            },
            lmap_updateZoom(event) {
                // фиксим ошибку vue-leaflet, который выбрасывает два события подряд
                if (this._prevZoom && _.isEqual(this._prevZoom, event)) {
                    return
                }
                this.$emit('update:zoom', event)
                this._prevZoom = event
            }
        },
        created() {
            if (this.storageKey && localStorage) {
                this.restore()
            }
        },
        async mounted() {
            this.$nextTick(() => {
                this.map = this.$refs.map.mapObject
                // this.map.on('geosearch/showlocation', console.log)
                this.map.on('click', () => {
                    // this.$emit('click', event)
                })
            })
        }
    }
</script>

<style>
    .leaflet-control-geosearch.bar {
        width: inherit !important;
    }

    .leaflet-control-container .leaflet-control-geosearch.bar {
        margin: 15px;
    }

    @import "~leaflet/dist/leaflet.css";
    @import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
</style>
