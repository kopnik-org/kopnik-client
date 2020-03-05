<template>
    <v-app id="inspire" :class="{'k-touch-device':isTouchDevice}">
        <v-snackbar v-if="application.errors.length" v-model="errorVisible" :timeout="0" multi-line top color="error">
            {{application.errors[application.errors.length-1].message ||
            application.errors[application.errors.length-1]}}
            <v-btn text xcolor="error" @click="errorVisible = false">
                Закрыть
            </v-btn>
        </v-snackbar>
        <v-snackbar v-if="application.infos.length" v-model="infoVisible" :timeout="10000" multi-line bottom color="info">
            {{ application.infos[application.infos.length-1] }}
            <v-btn text xcolor="error" @click="infoVisible = false">
                Закрыть
            </v-btn>
        </v-snackbar>
        <v-app-bar v-if="application.user" app color="indigo">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>kopnik.org</v-toolbar-title>
        </v-app-bar>
        <DrawerVue v-if="application.user" v-model="drawer" style="z-index: 700;"></DrawerVue>
        <v-content>
            <LoginVue v-if="!application.user && application.section!=='Thanks'"></LoginVue>
            <!--            <keep-alive :exclude="[Main]">-->
            <!--                <transition :name="contentTransitionName">-->
            <component class="k-content" v-bind:is="application.section+'Vue'" :value="application.user"></component>
            <!--                </transition>-->
            <!--            </keep-alive>-->
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
    import {container} from "../bottle/bottle";
    import DrawerVue from "./DrawerVue";
    import logger from './mixin/logger'
    import Application from "../application/Application";
    import {Kopnik} from '../models'
    import flushPromises from "flush-promises";
    import TenVue from './KTen'
    import touchDetector from "./mixin/touch-detecter";

    export default {
        mixins: [touchDetector, logger],
        components: {
            DrawerVue,
            LoginVue,
            ProfileVue,
            MainVue,
            ThanksVue,
            WitnessVue,
            TenVue
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
                    await this.application.lockSection(async () => {
                        await this.application.setSection(Application.Section.Profile)
                        this.application.infos.push('Для начала пройдите регистрацию. После этого станут доступны все возможности системы.')
                    })
                }
            },
            /**
             * меняем роут вслед за изменением раздела в моделе
             */
            'application.SECTION': async function (current, prev) {
                await this.application.lockSection(async () => {
                    if (this.application.section !== this.$route.name) {
                        // вызывается асинхронно, чтобы предотвратить рекурсивный lockSection
                        this.$router.push({name: this.application.section})
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
            },
            contentTransitionName() {
                let result = this.application.SECTION === Application.Section.Main ? 'content2main' : 'content2other'
                this.logger.log(result)
                return result
            },
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
        created(){

        },
        mounted() {
            this.$nextTick(() => {
                // this.map=
                // this.$refs.map.mapObject.setView([51.505, -0.09], 13)

            })
            /*            window.addEventListener('beforeunload', (event) => {
                            // Cancel the event as stated by the standard.
                            event.preventDefault();
                            // Chrome requires returnValue to be set.
                            event.returnValue = '';
                        });*/
        }
    }
</script>

<style lang="scss">
    .content2other-leave {
        position: absolute;
    }

    .content2other-leave-to {
    }

    .content2other-leave-active {
        transition: all 0.1s ease-out;
        position: absolute;
    }

    .content2other-enter {
        transform: translateY(100vh);
    }

    .content2other-enter-to {
        transform: translateY(0);
    }

    .content2other-enter-active {
        transition: all 0.1s ease-in;
    }

    .content2main-leave {
        position: absolute;
    }

    .content2main-leave-to {
        transform: translateY(100vh);
    }

    .content2main-leave-active {
        transition: all 0.1s ease-out;
        position: absolute;
        z-index: 1;
    }

    .content2main-enter {
        /*transform: translateY(100vh);*/
    }

    .content2main-enter-to {
        /*transform: translateY(0);*/
    }

    .content2main-enter-active {
        transition: all 0.1s ease-in;
    }
</style>
