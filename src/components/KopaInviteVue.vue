<template>
    <v-row class="flex-wrap ml-5 mr-5" no-gutters>
        <template v-for="(eachPart, eachPartIndex) of value.parts">
            <v-col :key="eachPartIndex"
                   class="d-flex pl-1 pr-1 pb-2" style="flex: 0 0 20%; width: 20%;">
                <v-avatar v-if="eachPart" :value="eachPart" style="flex-grow: 1; height: auto;"
                          @click="avatar_click(eachPart)">
                    <v-img :src="eachPart.photo"></v-img>
                </v-avatar>
                <v-avatar v-else class="part-empty" style="flex-grow: 1; height: auto;">
                    <v-img src="logo circle.png"></v-img>
                </v-avatar>
                <!--                    <div style="width: 100%">a</div>-->
            </v-col>
            <!--                <v-responsive
                                    v-if="eachPartIndex === 4"
                                    key="5-responsive"
                                    width="100%"
                            ></v-responsive>-->
        </template>
        <slot></slot>
    </v-row>
</template>
<script>
    import _ from 'lodash'
    import {bottle, container} from "../plugins/bottle";
    import i18n from "../plugins/i18n";
    import logger from "./mixin/logger";
    import {Kopa, Kopnik} from "../models";

    export default {
        name: "KopaInvite",
        mixins: [logger],
        components: {},

        data() {
            return {
                application: container.application,
            }
        },
        props: {
            value: {
                type: Kopa
            }
        },
        computed: {},
        watch: {},
        methods: {
            avatar_click(part) {
                this.application.selected = part
            }
        },
        async created() {

        },
        async mounted() {

        }
    }
</script>
<style>
    .tagline {
        border-radius: 4px;
        line-height: 1;
        background-color: white;
    }
</style>
