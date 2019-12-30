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
                <!--                <router-view></router-view>-->
                <component v-bind:is="application.SECTION+'Vue'"></component>
                <!--                </keep-alive>-->
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import Vue from 'vue'

    import LoginVue from './LoginVue'
    import MainVue from './MainVue'
    import ThanksVue from './ThanksVue'
    import ProfileVue from "./ProfileVue";
    import WitnessVue from "./WitnessVue";
    import {container} from "../plugins/bottle";
    import DrawerVue from "./DrawerVue";
    import logger from './mixin/logger'
    import Application from "../Application";
    import {Kopnik} from '../models'
    import flushPromises from "flush-promises";

    export default {
        mixins: [logger],
        components: {
            DrawerVue,
            LoginVue,
            ProfileVue,
            MainVue,
            ThanksVue,
            WitnessVue
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
        watch: {
            'application.user': async function (current, old) {
                if (current && (current.status === Kopnik.Status.NEW || current.status === Kopnik.Status.DECLINED)) {
                    await application.lockSection(async () => {
                        await this.application.setSection(Application.section.Profile)
                    })
                }
            },
            'application.SECTION': async function (current, prev) {
                await application.lockSection(async () => {
                    if (application.SECTION !== this.$route.name) {
                        // вызывается асинхронно, чтобы предотвратить рекурсивный lockSection
                        this.$router.push({name: this.application.SECTION})
                    }
                })
            },
        },
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
