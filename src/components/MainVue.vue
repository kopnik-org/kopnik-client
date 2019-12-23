<template>
    <div style="align-self: stretch; margin: -12px;" class="flex-grow-1">
        <v-dialog v-model="details.show" max-width="300">
            <v-card>
                <kopnik-vue :value="details.value" @click="kopnik_click"></kopnik-vue>
                <v-card-actions class="flex-wrap">
                    <v-btn text1 block>
                        Чат
                    </v-btn>
                    <div></div>
                    <v-btn text1 block class="mt-2">
                        В участники копы
                    </v-btn>
                    <div></div>
                    <v-btn text1 block class="mt-2" @click="details.show = true" >
                        Выбрать старшиной
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- zoom-control передается дальшее в options LMap, а они не реактиные, поэтому сразу нужно ставить true-->
        <MapVue ref="map" :center.sync="center" :zoom.sync="zoom"
                :layers-control="application.user"
                :locate-control="application.user"
                :scale-control="application.user"
                :zoom-control="true"
                storage-key="MainVue.map"
                @update:bounds="map_updateBounds"
                style="z-index: 0">
<!--            <l-marker :lat-lng="center">
                <l-icon
                        :icon-size="[64, 64]"
                        :icon-anchor="[32,32]"
                        icon-url="logo circle.png">
                </l-icon>
            </l-marker>-->
            <l-marker v-for="(eachTop) of application.top20" :key="eachTop.id"
                      :lat-lng="eachTop.location" @click="onKopnikClick(eachTop)">
                <l-tooltip>{{eachTop.name}}</l-tooltip>
                <!--                <l-popup>l-popup!</l-popup>-->
            </l-marker>
        </MapVue>
    </div>
</template>
<script>
    import {
        LTooltip,
        LPopup,
        LIcon,
        LControlScale,
        LMap,
        LTileLayer,
        LMarker,
        LControlAttribution,
        LControlLayers,
        LControl
    } from 'vue2-leaflet'
    import {Kopnik} from "../models"
    import KopnikVue from "./KopnikVue";
    import MapVue from "./MapVue";
    import {container} from "../plugins/bottle";

    export default {
        components: {
            KopnikVue,
            LMap,
            LTileLayer,
            LMarker,
            LControlAttribution,
            LControlLayers,
            LControl,
            LControlScale,
            LIcon,
            LPopup,
            LTooltip,
            MapVue
        },
        props: {
        },
        data(){
            return {
                zoom: 2,
                center: [55.753215, 37.622504],
                application: container.application,
                details: {show: false, value: null},
            }
        },
        computed:{
          mapZoomControl(){
              return this.application.user instanceof Kopnik
          }
        },
        watch: {
            'application.user': async function (current, old) {
                if (current){
                    await this.application.loadTop20()
                }
            },
        },
        methods: {
            onLocationClick() {
                alert("getInstance current location")
            },
            onKopnikClick(kopnik) {
                this.details.value = kopnik
                this.details.show = true
            },
            async map_updateBounds(event) {
                // await Kopnik.fetchApi("list")
            },
            kopnik_click(){
                this.details.show= false
            }
        },
        created() {
        },
        async mounted() {
            this.$nextTick(() => {
                // this.map= this.$refs.map.mapObject.setView([51.505, -0.09], 13)
            })
            await this.application.resolveUser()
        }
    }
</script>
