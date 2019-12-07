<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app>
            <v-list dense>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-contact-mail</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Contact</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
                app
                color="indigo"
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>Application</v-toolbar-title>
        </v-app-bar>

        <v-content>
            <v-container class="fill-height" fluid>
                <Login v-if="!app.user" @login="login_login" class="d-flex justify-center align-center" style="position:absolute; left:0; top:0; z-index: 1000; right: 0; bottom: 0;"></Login>
                <div :is="app.SECTION" style="flex-grow: 1"></div>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import {LTooltip, LPopup, LIcon, LControlScale, LMap, LTileLayer, LMarker, LControlAttribution, LControlLayers, LControl} from 'vue2-leaflet';

    import Application from "../Application";
    import Map from "./Map"
    import Profile from "./Profile"
    import Login from "./Login";

    export default {
        components: {
            Login,
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
            Map,
            Profile
        },
        props: {
            source: String,
        },
        data: (() => {
            let app = global.app = new Application
            app.initUser()

            return {
                app,
                drawer: null,
                center: [47.413220, -1.219482],
                zoom: 14,
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
            }
        }),
        computed:{
            user(){
                return this.$options.app.user
            }
        },
        methods: {
            onLocationClick()
            {
            },
            onKopnikClick(kopnik){
                alert("Open face dialog ")
            },
            login_login(){

            }
        },
        mounted() {
            this.$nextTick(() => {
                // this.map=
                // this.$refs.map.mapObject.setView([51.505, -0.09], 13)

            })
        }
    }
</script>
