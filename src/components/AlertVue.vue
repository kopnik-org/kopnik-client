<template>
    <div>
        <v-snackbar v-if="hasError" v-model="errorVisible" :timeout="0" multi-line top color="error">
            {{currentError.message}}
            <template v-if="currentError.code"> ({{ currentError.code }})</template>
            <v-btn text xcolor="error" @click="errorVisible = false">
                Закрыть
            </v-btn>
        </v-snackbar>
        <v-snackbar v-if="hasInfos" v-model="infoVisible" :timeout="0" multi-line bottom color="info">
            {{ currentInfo }}
            <v-btn text xcolor="error" @click="infoVisible = false">
                Закрыть
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import Vue from 'vue'

    import LoginVue from './LoginVue'
    import MainVue from './MainVue'
    import ThanksVue from './ThanksVue'
    import ProfileVue from "./ProfileVue";
    import WitnessVue from "./WitnessVue";
    import {container} from "../bottle";
    import DrawerVue from "./DrawerVue";
    import logger from './mixin/logger'
    import Application from "../application/Application";
    import {Kopnik} from '../models'
    import flushPromises from "flush-promises";
    import TenVue from './KTen'
    import touchDetector from "./mixin/touch-detecter";

    export default {
        mixins: [logger],
        components: {},
        data() {
            return {
                application: container.application,
                errorVisible: false,
                infoVisible: false,
            }
        },
        computed: {
            hasError(){
                return this.application.errors.length
            },
            hasInfos(){
                return this.application.infos.length
            },
            currentError() {
                const errors = this.application.errors
                if (this.hasError) {
                    return (errors[errors.length - 1] instanceof Error) ? errors[errors.length - 1] : new Error(errors[errors.length - 1])
                }
                return null
            },
            currentInfo() {
                const infos = this.application.infos
                if (this.hasInfos) {
                    return infos[infos.length - 1]
                }
                return null
            },
        },
        watch:{
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
        }
    }
</script>

<style lang="scss">
</style>
