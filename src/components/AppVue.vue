<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app>
            <router-link to="/profile" class="cursor-pointer" tag="div">
                <kopnik v-if="$root.$data.app.user" v-model="$root.$data.app.user" to="/profile"
                        :avatar-size="150" class="flex-grow-1">
                </kopnik>
            </router-link>
            <v-list :dense="false" subheader>
                <v-list-item link to="/">
                    <v-list-item-action>
                        <v-icon>mdi-home-city</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Карта</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-account-multiple</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Моя десятка</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-chat</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Чат десятки</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-chat</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Чат старшины</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link to="/witness">
                    <v-list-item-action>
                        <v-icon>mdi-human-greeting</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Заявки на вступление</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-icon>mdi-account-question</v-icon>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item link to="/thanks">
                    <v-list-item-action>
                        <v-icon>mdi-heart</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Благодарность</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-help-circle</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Подсказка</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-location-exit</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Выход</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
                app
                color="indigo"
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>kopnik.org</v-toolbar-title>
        </v-app-bar>

        <v-content>
            <v-container class="fill-height" fluid>
                <!--                <Auth v-if="!app.user" @login="login_login" class="d-flex justify-center align-center"
                                      style="position:absolute; left:0; top20:0; z-index: 1000; right: 0; bottom: 0;"></Auth>-->
                <!--                <div :is="app.SECTION" style="flex-grow: 1"></div>-->
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>

    import Application from "../Application";
    import Kopnik from "./KopnikVue";

    export default {
        components: {
            Kopnik,
        },
        props: {
            source: String,
        },
        data: (() => {
            let app = global.app
            // app.authenticate()

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
            }
        }),
        computed: {
            user() {
                return this.$options.app.user
            }
        },
        methods: {
            onLocationClick() {
            },
            onKopnikClick(kopnik) {
                alert("Open face details ")
            },
            login_login() {

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

<style scoped>
    .cursor-pointer{
        cursor: pointer;
    }
</style>
