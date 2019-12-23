<template>

    <LMap ref="map" :center="center" :zoom="zoom" :options="{zoomControl: zoomControl}"
          @leafletevent="leafLet_event" @update:bounds="map_updateBounds" @update:center="map_updateCenter"
          @update:zoom="map_updateZoom"
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
        <l-control-layers v-if="layersControl" position="topright"></l-control-layers>
        <l-control-scale v-if="scaleControl" position="bottomright" :imperial="false" :metric="true"></l-control-scale>
        <v-locatecontrol v-if="locateControl" :options="locateOptions"></v-locatecontrol>
                <l-control position="bottomright">
<!--                    <button @click="onLocationClick">-->
<!--                        Текущее местоположение-->
<!--                    </button>-->
                </l-control>
        <slot></slot>
    </LMap>
</template>
<script>
    import {OpenStreetMapProvider} from 'leaflet-geosearch';

    import {
        LTooltip,
        LPopup,
        LIcon,
        LControlScale,
        LMap,
        LTileLayer,
        LMarker,
        LControlAttribution,
        LControlLayers,
        LControl,
        LControlZoom
    } from 'vue2-leaflet'
    import VGeosearch from 'vue2-leaflet-geosearch';
    import VLocatecontrol from 'vue2-leaflet-locatecontrol/Vue2LeafletLocatecontrol'
    import {container} from "../plugins/bottle";

    export default {
        name: 'MapVue',
        components: {
            VGeosearch,
            LMap,
            LTileLayer,
            LMarker,
            LControlAttribution,
            LControlLayers,
            LControl,
            LControlScale,
            LIcon,
            LPopup,
            LTooltip,
            LControlZoom,
            VLocatecontrol,
        },
        props: {
            center: {
                type: [Array, Object],
                // default: () => [55.753215, 37.622504]
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
            scaleControl:{

            }
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
        }
        ,
        methods: {
            leafLet_event(event) {
                alert(event)
            }
            ,
            store() {
                if (!this.storageKey) {
                    throw new Error("No storage key provided")
                }
                const correctedCenter = Object.assign({}, this.center)
                correctedCenter.lng = Math.min(correctedCenter.lng, 180)
                correctedCenter.lng = Math.max(correctedCenter.lng, -180)
                localStorage.setItem(this.storageKey, JSON.stringify({
                    center: correctedCenter,
                    zoom: this.zoom
                }))
            },
            restore() {
                if (!this.storageKey) {
                    throw new Error("No storage key provided")
                }
                let storedData = localStorage.getItem(this.storageKey)
                if (storedData) {
                    console.log('should be center+loocation', storedData)
                    storedData = JSON.parse(storedData)
                    if (storedData.zoom) {
                        this.map_updateZoom(storedData.zoom)
                    }
                    if (storedData.center) {
                        this.map_updateCenter(storedData.center)
                    }
                }
            }
            ,
            onLocationClick() {
                alert("getInstance current location")
            }
            ,
            map_updateBounds(event) {
                this.$emit('update:bounds', event)
            }
            ,
            map_updateCenter(event) {
                this.$emit('update:center', event)
                if (this.storageKey && localStorage) {
                    this.store()
                }
            }
            ,
            map_updateZoom(event) {
                this.$emit('update:zoom', event)
                if (this.storageKey && localStorage) {
                    this.store()
                }
            }
        }
        ,
        created() {
            if (this.storageKey && localStorage) {
                this.restore()
            }
        }
        ,
        async mounted() {
            this.$nextTick(() => {
                // this.map = this.$refs.map.mapObject
                // this.map.on('geosearch/showlocation', console.log)
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
