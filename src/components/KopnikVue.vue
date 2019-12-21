<template>
    <v-list @click.native="list_click">
<!--        @click.native="$router.push(to)"-->
        <v-list-item>
            <v-list-item-avatar :tile="avatarTile" :size="avatarSize" class="{avatarMxAuto: 'mx-auto'}">
                <img :src="value.photo" style="object-fit: cover; "/>
            </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    {{value.lastName }} {{value.firstName }} {{value.patronymic }}
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
</template>
<script>
    import {LMarker} from 'vue2-leaflet'
    import Kopnik from "../models/Kopnik"
    import MapVue from "./MapVue";
    import log from "./mixin/log"

    export default {
        name: "Kopnik",
        mixins: [log],
        components: {
            MapVue,
            LMarker
        },
        data: () => {
            return {}
        },
        props: {
            avatarSize: {
                type: Number,
                default: 150
            },
            avatarTile:  {
                type: Boolean,
                default: false
            },
            avatarMxAuto:{
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
            to:{
                type: [String, Object]
            },
            location:{
                type: Boolean
            },
        },
        filters:{
          undefined(value){
              return value===undefined?'':value
          }
        },
        computed: {},
        watch: {},
        methods: {
            list_click(event){
                this.$emit('click', event)
            }
        },
        async created() {
            await this.value.loaded()
        },
        async mounted() {
        }
    }
</script>
