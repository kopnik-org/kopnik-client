<template>
    <v-app id="inspire">
        <v-snackbar v-if="application.errors.length" v-model="errorVisible" :timeout="0" multi-line top color="error">
            {{application.errors[application.errors.length-1].message}}
            <v-btn text  xcolor="error" @click="errorVisible = false">
                Закрыть
            </v-btn>
        </v-snackbar>
        <v-snackbar v-if="application.infos.length" v-model="infoVisible" bottom color="info">
            {{ application.infos[application.infos.length-1] }}
        </v-snackbar>
        <v-app-bar v-if="application.user" app color="indigo">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>kopnik.org</v-toolbar-title>
        </v-app-bar>
        <DrawerVue v-if="application.user" v-model="drawer"></DrawerVue>
        <v-content>
            <LoginVue v-if="!application.user"></LoginVue>
            <v-container class="fill-height" fluid>
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
                errorVisible: false,
                infoVisible: false,
            }
        },
        watch: {
            'application.user': async function (current, old) {
                if (current && (current.status === Kopnik.Status.NEW || current.status === Kopnik.Status.DECLINED)) {
                    await application.lockSection(async () => {
                        await this.application.setSection(Application.section.Profile)
                        this.application.infos.push('Для начала пройдите регистрацию. После этого станут доступны все возможности системы.')
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
            async 'application.infos.length'(current, old) {
                this.infoVisible = false
                await Vue.nextTick()
                this.infoVisible = true
            },
            async 'application.errors.length'(current, old) {
                this.errorVisible = false
                await Vue.nextTick()
                this.errorVisible = true
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
