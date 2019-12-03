<template>
    <form>
        <v-combobox ref="locale"
                        :value="locale"
                :items="locales"
                :auto-select-first="true"
                    :label="$t('profile.language')"
                @change="$emit('update:locale', $event.value)"
        ></v-combobox>
        <v-text-field
                v-model="value.surname"
                :label="$t('profile.surname')"
        ></v-text-field>
        <v-text-field
                v-model="value.firstname"
                :label="$t('profile.firstname')"
        ></v-text-field>
        <v-text-field
                v-model="value.patronymic"
                :label="$t('profile.patronymic')"
        ></v-text-field>
        <v-text-field
                v-model="value.nick"
                :label="$t('profile.nick')"
        ></v-text-field>
        <v-text-field
                v-model="value.birthyear"
                :label="$t('profile.birthyear')"
        ></v-text-field>
        <v-text-field
                v-model="value.passport"
                :label="$t('profile.passport')"
        ></v-text-field>
        <LMap ref="map" :center.sync="center" :zoom="zoom" class="" style="z-index: 0; height: 50vh;" >
            <l-tile-layer ref="map"
                    v-for="tileProvider in tileProviders"
                    :key="tileProvider.name"
                    :name="tileProvider.name"
                    :visible="tileProvider.visible"
                    :url="tileProvider.url"
                    :attribution="tileProvider.attribution"
                    :token="tileProvider.token"
                    layer-type="base"/>
            <l-marker :lat-lng="center"></l-marker>
        </LMap>
        <v-btn color="primary" block class="v-column v-col mt-10 xm-auto flex-align-center">Отправить заявку</v-btn>
    </form>
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
    } from 'vue2-leaflet';

    import Kopnik from "../models/Kopnik"
    import log from "./mixin/log"

    export default {
        name:"Profile",
        mixins:[log],
        components: {
            LMap,
            LTileLayer,
            LMarker
        },

        data: () => {
            return {
                locales: [
                    {
                        text: "Русский",
                        value: "ru"
                    },
                    {
                        text: "English",
                        value: "en"
                    }
                ],
                center: [55.753215, 37.622504],
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
            }
        },
        props: {
            value: {
                type: Kopnik,
                // required: true
            },
            locale: {
                type: String,
                // required: true
            },
            zoom: {
                type: Number,
                default: 14
            },
        },
        computed:{
          // locales2: ()=> this.locales
        },
        methods: {}
    }
</script>