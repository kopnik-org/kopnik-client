<template>
    <v-app id="inspire" :class="{'k-touch-device':isTouchDevice}">
        <alert-vue/>
        <v-app-bar v-if="application.user" app>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>kopnik.org v{{ packageVersion }}</v-toolbar-title>
        </v-app-bar>
        <DrawerVue v-if="application.user" v-model="drawer" style="z-index: 700;"></DrawerVue>
        <v-main>
            <LoginVue v-if="!application.user && application.section!=='Thanks'"></LoginVue>
            <!--            <keep-alive :exclude="[Main]">-->
            <!--                <transition :name="contentTransitionName">-->
            <component class="k-content" v-bind:is="application.section+'Vue'" :value="application.user"></component>
            <!--                </transition>-->
            <!--            </keep-alive>-->
        </v-main>
    </v-app>
</template>

<script>
    import Vue from 'vue'

    import LoginVue from '../LoginVue'
    import MainVue from '../MainVue'
    import ThanksVue from '../KThanks'
    import ProfileVue from "../ProfileVue";
    import WitnessVue from "../WitnessVue";
    import {container} from "../../bottle/bottle";
    import DrawerVue from "../DrawerVue";
    import logger from '../mixin/logger'
    import Application from "../../application/Application";
    import {Kopnik} from '../../models'
    import flushPromises from "flush-promises";
    import TenVue from '../KSubordinates'
    import touchDetector from "../mixin/touch-detecter";
    import AlertVue from "../AlertVue";
    import {localize} from "vee-validate";

    export default {
        mixins: [touchDetector, logger],
        components: {
            DrawerVue,
            LoginVue,
            ProfileVue,
            MainVue,
            ThanksVue,
            WitnessVue,
            TenVue,
            AlertVue,
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
            'application.user.locale': async function (current, old) {
                if (current) {
                    this.followUserLocale()
                }
            },
            /**
             * меняем роут вслед за изменением раздела в моделе
             */
            'application.section': async function (current, prev) {
                // ожидаем выполнения промисов внктри application.setSection()
                await flushPromises()
                if (this.application.section !== this.$route.name) {
                    await this.$router.push({name: this.application.section})
                }
            },
        },
        computed: {
            packageVersion() {
                return process.env.PACKAGE_VERSION
            },
        },
        methods: {
            async followUserLocale() {
                const locale = this.application.user.locale
                // задаем текущую локаль приложению
                container.localeManager.currentLocale = locale
                // vue-i18n меняем сообщения в разметке страниц
                this.$options.i18n.locale = locale.name
                // vuetify меняем сообщения в разметке vuetify
                this.$vuetify.lang.current = locale.name
                // vee-valiedate меняем сообщения об ошибках валидации
                localize(locale.name)

            },
            this_escclick(event) {
                if (this.application.squadAnalyzer.isAnalyzing()) {
                    this.application.squadAnalyzer.reset()
                    event.stopPropagation()
                    event.preventDefault()
                }
            },
        },
        created() {

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
