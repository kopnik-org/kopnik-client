<template>
    <v-app id="inspire">
        <v-app-bar
                app
                color="indigo"
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>kopnik.org</v-toolbar-title>
        </v-app-bar>
        <DrawerVue v-model="drawer"></DrawerVue>
        <v-content>
            <LoginVue v-if="!application.user"></LoginVue>
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

    import KopnikVue from "./KopnikVue";
    import LoginVue from './LoginVue'
    import {container} from "../plugins/bottle";
    import DrawerVue from "./DrawerVue";
    import log from './mixin/log'
    import {localize} from 'vee-validate'

    export default {
        mixins: [log],
        components: {
            DrawerVue,
            KopnikVue,
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
            locale(){
                return this.application.user?this.application.user.locale:'ru'
            }
        },
        methods: {

        },
        mounted() {
            this.$nextTick(() => {
                // this.map=
                // this.$refs.map.mapObject.setView([51.505, -0.09], 13)

            })
        }
    }
</script>
