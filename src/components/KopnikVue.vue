<template>
    <div v-if="value" class="d-flex flex-nowrap">
        <v-avatar :tile="avatarTile" :size="avatarSize" class="{avatarMxAuto: 'mx-auto'}"
                  @click="avatar_click" @dblclick="avatar_dblclick">
            <img :src="value.photo" style="object-fit: cover; "/>
        </v-avatar>
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title text-wrap">
                        {{value.name}}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="birthyear">
                <v-text-field v-model="value.birthyear" :label="$t('profile.birthyear')" readonly></v-text-field>
            </v-list-item>
            <v-list-item v-if="passport">
                <v-text-field v-model="value.passport" :label="$t('profile.passport')" readonly></v-text-field>
            </v-list-item>
            <v-list-item v-if="location">
                <MapVue ref="map" :center="value.location" :zoom="14"
                        :zoom-control="false" :layers-control="false" :locate-control="false"
                        class="" style="z-index: 0; height: 50vh;">
                    <l-marker :lat-lng="value.location"></l-marker>
                </MapVue>
            </v-list-item>
        </v-list>
    </div>
</template>
<script>
    import {LMarker} from 'vue2-leaflet'
    import Kopnik from "../models/Kopnik"
    import MapVue from "./MapVue";
    import logger from "./mixin/logger"
    import {container} from "../plugins/bottle";

    export default {
        name: "Kopnik",
        mixins: [logger],
        components: {
            MapVue,
            LMarker
        },
        data: () => {
            return {
                application: container.application
            }
        },
        props: {
            avatarSize: {
                type: Number,
                default: 150
            },
            avatarTile: {
                type: Boolean,
                default: false
            },
            avatarMxAuto: {
                type: Boolean,
                default: false
            },
            value: {
                type: Kopnik
            },
            birthyear: {
                type: Boolean,
                default: false
            },
            passport: {
                type: Boolean,
                default: false
            },
            to: {
                type: [String, Object]
            },
            location: {
                type: Boolean
            },
        },
        filters: {
            undefined(value) {
                return value === undefined ? '' : value
            }
        },
        computed: {},
        watch: {},
        methods: {
            avatar_click() {
                this.$emit('click', this.value)
            },
            avatar_dblclick() {
                this.$emit('dblclick', this.value)
            },
        },
        async created() {
            await this.value.loaded()
        },
        async mounted() {
        }
    }
</script>
