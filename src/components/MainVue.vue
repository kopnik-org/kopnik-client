<template>
    <div style="align-self: stretch; margin: -12px;" class="flex-grow-1">
        <v-dialog v-model="details.show" max-width="300">
            <v-card>
                <kopnik-vue :value="details.value"></kopnik-vue>
                <v-card-actions class="flex-wrap">
                    <v-btn text1 block>
                        Чат
                    </v-btn>
                    <div></div>
                    <v-btn text1 block class="mt-2">
                        В участники копы
                    </v-btn>
                    <div></div>
                    <v-btn text1 block class="mt-2" @click="details.show = true">
                        Выбрать старшиной
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LMap ref="map" :center="center" :zoom="zoom" v-on:update:bounds="map_update_bounds" style="z-index: 0">
            <l-tile-layer
                    v-for="tileProvider in tileProviders"
                    :key="tileProvider.name"
                    :name="tileProvider.name"
                    :visible="tileProvider.visible"
                    :url="tileProvider.url"
                    :attribution="tileProvider.attribution"
                    :token="tileProvider.token"
                    layer-type="base"/>
            <l-control-layers position="topright"></l-control-layers>
            <l-control-scale position="bottomright" :imperial="false" :metric="true"></l-control-scale>
            <l-control position="bottomright">
                <button @click="onLocationClick">
                    I am a useless button!
                </button>
            </l-control>
            <l-marker :lat-lng="center">
                <l-icon
                        :icon-size="[64, 64]"
                        :icon-anchor="[32,32]"
                        icon-url="logo  circle.png">
                </l-icon>
            </l-marker>
            <l-marker v-for="(eachTop, index) of top20" :key="eachTop.id"
                      :lat-lng="eachTop.location" @click="onKopnikClick(eachTop)">
                <l-tooltip>{{eachTop.name}}</l-tooltip>
                <!--                <l-popup>l-popup!</l-popup>-->
            </l-marker>
        </LMap>
    </div>
</template>
<script>
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
        LControl
    } from 'vue2-leaflet'
    import {Kopnik} from "../models"
    import KopnikVue from "./KopnikVue";

    export default {
        components: {
            KopnikVue,
            LMap,
            LTileLayer,
            LMarker,
            LControlAttribution,
            LControlLayers,
            LControl,
            LControlScale,
            LIcon,
            LPopup,
            LTooltip
        },
        props: {
            center: {
                type: Array,
                default: () => [55.753215, 37.622504]
            },
            zoom: {
                type: Number,
                default: 14
            },
        },
        data: () => ({
            application: null,
            top20: [],
            details: {show: false, value: null},
            dialogKopnik: null,
            tileProviders: [
                {
                    name: "OpenStreetMap",
                    visible: false,
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
                    token: null
                },
                {
                    name: "Dark",
                    visible: true,
                    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: "abcd",
                    token: null
                },
                {
                    name: "GIScience",
                    visible: false,
                    url: "https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png",
                    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    subdomains: "abcd",
                    token: null
                }
            ],
        }),
        methods: {
            onLocationClick() {
                alert("getInstance current location")
            },
            onKopnikClick(kopnik) {
                this.details.value = kopnik
                this.details.show = true
            },
            async map_update_bounds(event) {
                // await Kopnik.fetchApi("list")
            }
        },
        created() {
            this.$data.application = global.app
        },
        async mounted() {
            this.$nextTick(() => {
                // this.map= this.$refs.map.mapObject.setView([51.505, -0.09], 13)

            })
            if (global.app.user === undefined) {
                await global.app.authenticate()
            }
            this.top20 = await Promise.all([1, 2, 3, 4].map(each => Kopnik.get(each)))
        }
    }
</script>
