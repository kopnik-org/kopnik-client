<template>
    <v-app id="inspire"
    >
        <v-app-bar v-if="application.user" app color="indigo">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>kopnik.org</v-toolbar-title>
        </v-app-bar>
        <DrawerVue v-if="application.user" v-model="drawer"></DrawerVue>
        <v-content>
            <LoginVue v-if="!application.user"></LoginVue>
            <v-container class="fill-height" fluid>
                <!--                <Auth v-if="!app.user" @login="login_login" class="d-flex justify-center align-center"
                                      style="position:absolute; left:0; top20:0; z-index: 1000; right: 0; bottom: 0;"></Auth>-->
                <!--                <div :is="app.SECTION" style="flex-grow: 1"></div>-->
                <!--                <keep-alive>-->
                <router-view></router-view>
                <!--                </keep-alive>-->
            </v-container>
        </v-content>
    </v-app>
</template>

<script>

    import LoginVue from './LoginVue'
    import {container} from "../plugins/bottle";
    import DrawerVue from "./DrawerVue";
    import logger from './mixin/logger'

    export default {
        mixins: [logger],
        components: {
            DrawerVue,
            LoginVue
        },
        props: {
            source: String,
        },
        data() {
            return {
                application: container.application,
                center: [47.413220, -1.219482],
                zoom: 14,
                drawer: false,
            }
        },
        watch: {},
        computed: {
            locale() {
                return this.application.user ? this.application.user.locale : 'ru'
            }
        },
        methods: {
            this_escclick(event) {
                if (this.application.squadAnalyzer.isAnalyzing()) {
                    this.application.squadAnalyzer.reset()
                    event.stopPropagation()
                    event.preventDefault()
                }
            },

        },
        mounted() {
            this.$nextTick(() => {
                // this.map=
                // this.$refs.map.mapObject.setView([51.505, -0.09], 13)

            })
        }
    }
</script>
