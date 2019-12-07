<template>
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
        <l-marker :lat-lng="center" @click="onKopnikClick(kopnik)">
            <l-tooltip>Борода</l-tooltip>
            <!--
    <l-popup>Hello!</l-popup>-->
        </l-marker>
    </LMap>
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

    export default {
        components: {
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
                default: ()=>[55.753215, 37.622504]
            },
            zoom: {
                type: Number,
                default: 14
            },
        },
        data: () => ({
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
            kopnik: {
                name: "Борода"
            }
        }),
        methods: {
            onLocationClick() {
                alert("getInstance current location")
            },
            onKopnikClick(kopnik) {
                alert("Open face dialog ")
            },
            async map_update_bounds(event){
                // await Kopnik.fetch("list")
            }
        },
        mounted() {
            this.$nextTick(() => {
                // this.map= this.$refs.map.mapObject.setView([51.505, -0.09], 13)

            })
        }
    }
</script>
