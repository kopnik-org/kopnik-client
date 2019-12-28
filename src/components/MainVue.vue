<template>
    <div id="main" ref="main"
         @keyup.esc="this_keydown_esc"
         style="align-self: stretch; margin: -12px;" class="flex-grow-1">
        <!-- zoom-control передается дальшее в options LMap, а они не реактиные, поэтому сразу нужно ставить true-->
        <MapVue ref="map" :center.sync="center" :zoom.sync="zoom"
                :layers-control="application.user"
                :locate-control="application.user"
                :scale-control="application.user"
                :zoom-control="true"
                storage-key="MainVue.map"
                @update:bounds="map_updateBounds"
                style="z-index: 0"
                @click.native="application.selected=null"
        >
            <!--            <l-marker :lat-lng="center">
                            <l-icon
                                    :icon-size="[64, 64]"
                                    :icon-anchor="[32,32]"
                                    icon-url="logo circle.png">
                            </l-icon>
                        </l-marker>-->
            <template v-for="eachArrow of arrows">
                <!--                стрелка на конце-->
                <vue2-leaflet-polyline-decorator :key="'arrow'+eachArrow.from.id"
                                                 :paths="[eachArrow.from.location, eachArrow.to.location]"
                                                 :patterns="eachArrow.patterns">
                </vue2-leaflet-polyline-decorator>
                <!--                видимая линия-->
                <l-polyline :key="'stroke'+eachArrow.from.id"
                            :lat-lngs="[eachArrow.from.location, eachArrow.to.location]"
                            :weight="eachArrow.weight"
                            :color="eachArrow.color">
                </l-polyline>
                <!-- невидимая линия большой ширины, которая ловит mouseover -->
                <l-polyline :key="'hoverHandler'+eachArrow.from.id"
                            :lat-lngs="[eachArrow.from.location, eachArrow.to.location]"
                            :weight="10"
                            :opacity="0">
                    <l-tooltip :options="{sticky:true}">{{eachArrow.tooltip}}</l-tooltip>
                </l-polyline>
            </template>

            <l-marker v-for="(eachMarker) of markers" :key="'marker'+eachMarker.value.id"
                      :lat-lng="eachMarker.value.location"
                      :zIndexOffset="eachMarker.value.rank*1000"
                      @dblclick="marker_dblclick(eachMarker.value, $event)"
                      @click="marker_click(eachMarker.value, $event)"
            >
                <l-icon
                        :icon-size="[eachMarker.size, eachMarker.size]"
                        :icon-anchor="[eachMarker.size/2,eachMarker.size/2]"
                        class-name="map_kopnik-avatar"
                        icon-url="avatar.png">
                </l-icon>
                <l-tooltip v-if="!isTouchDevice" :options="{}">{{eachMarker.value.rankName}}</l-tooltip>
                <!--                <l-popup>l-popup!</l-popup>-->
            </l-marker>
            <l-control position="topright">
                <div v-if="application.squadAnalyzer.isAnalyzing()" class="d-flex flex-column align-center">
                    <v-btn fab small
                           title="Скрыть копные связи"
                           @click="this_keydown_esc"
                           style="order: -1000000000">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <!--                    <v-avatar v-for="eachMember of application.squadAnalyzer.members" :key="'avatar'+eachMember.id"
                                                  :size="48"
                                                  :title="eachMember.rankName"
                                                  :style="{order: -eachMember.rank}"
                                        >
                                            <v-img :src="eachMember.photo"></v-img>
                                        </v-avatar>-->
                </div>
            </l-control>
        </MapVue>
        <div v-if="application.kopa.parts.length" class="d-flex justify-center align-end" style="position: fixed; left: 0; right: 0;"
             :style="{bottom: kopaInviteBottom}">
            <kopa-invite ref="kopaInvite" :value="application.kopa" class="flex" style="width: 100%; max-width: 500px;">
                <v-btn fab small color="primary"
                       title="Созвать всех на копу..."
                       @click="inviteAll_click"
                       class="ml-auto mt-2">
                    <v-icon>mdi-run-fast</v-icon>
                </v-btn>
            </kopa-invite>
        </div>
        <v-bottom-sheet id="bottom-sheet" ref="bottomSheet" :value="application.selected" :attach="$refs.main"
                        persistent hide-overlay no-click-animation :retain-focus="false" :inset="true"
                        @input="details_input"
        >
            <v-card>
                <kopnik-vue :value="application.selected" :avatar-size="100" ></kopnik-vue>
                <v-card-actions class="flex-nowrap">
                    <v-btn text class="flex">
                        В беседу
                    </v-btn>
                    <v-btn text class="flex" @click="toggle_click">
                        {{application.kopa.isInvited(application.selected)?'Не звать':'На копу'}}
                    </v-btn>
                    <v-btn text class="flex" @click="">
                        В старшины
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>
<script>
    import L from 'leaflet'
    import {
        LPolyline,
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
    import Vue2LeafletPolylineDecorator from 'vue2-leaflet-polylinedecorator'
    import touchDetector from "./mixin/touch-detecter";
    import logger from "./mixin/logger";
    import KopaInvite from "./KopaInviteVue";

    // На 18-ом увеличении
    const ARROW_WIDTH = 10,
        TOOLTIP_ARROW_WITH = 15,
        MARKER_SIZE = 48,
        MIN_MARKER_SIZE = 24

    export default {
        mixins: [touchDetector, logger],
        components: {
            KopaInvite,
            Vue2LeafletPolylineDecorator,
            LPolyline,
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
        props: {},
        data() {
            return {
                zoom: 2,
                center: [55.753215, 37.622504],
                application: container.application,
                details: {show: false, value: null},
            }
        },
        computed: {
            kopaInviteBottom() {
                if (this.application.selected) {
                    return '150px'
                } else {
                    return 0
                }
            },
            markers() {
                const result = application.top20
                    .map(eachTop => {
                        return {
                            value: eachTop,
                            size: Math.max(MIN_MARKER_SIZE, Math.round(MARKER_SIZE * Math.pow(eachTop.rank, 1 / 3) / Math.pow(2, 18 - this.zoom))),
                        }
                    })
                // console.log(result)
                return result
            },
            arrows() {
                const squadAnalyzer = this.application.squadAnalyzer,
                    result = squadAnalyzer.members
                    // стрелки идкт если старшина в исследованной части
                        .filter(eachMember => squadAnalyzer.members.indexOf(eachMember.foreman) !== -1)
                        // стрелка идет от младшего к старшему
                        .map(eachMember => {
                            let color = (eachMember === squadAnalyzer.starter || squadAnalyzer.foremans.includes(eachMember)) && squadAnalyzer.foremans.includes(eachMember.foreman) ? 'red' : 'blue',
                                width = Math.max(1, Math.round(ARROW_WIDTH * Math.pow(eachMember.rank, 1 / 3) / Math.pow(2, 18 - this.zoom))),
                                eachArrow = {
                                    color,
                                    weight: width,
                                    tooltipWidth: TOOLTIP_ARROW_WITH,
                                    from: eachMember,
                                    to: eachMember.foreman,
                                    tooltip: eachMember.rankName + ' ⇨ ' + eachMember.foreman.rankName,
                                    patterns: [
                                        // defines a pattern of 10px-wide dashes, repeated every 20px on the line
                                        {
                                            offset: '100%',
                                            repeat: 0,
                                            symbol: L.Symbol.arrowHead({
                                                pixelSize: width * 2,
                                                polygon: true,
                                                pathOptions: {
                                                    color,
                                                    stroke: true,
                                                    fillOpacity: 1,
                                                }
                                            })
                                        },
                                    ]
                                }
                            return eachArrow
                        })
                return result
            },
            mapZoomControl() {
                return this.application.user instanceof Kopnik
            },

        },
        watch: {
            'application.user': async function (current, old) {
                if (current) {
                    await this.application.loadTop20()
                }
            },
        },
        methods: {
            inviteAll_click(){
                this.application.kopa.inviteAll()
            },
            details_input(event) {
                if (!event) {
                    this.application.selected = null
                }
            },
            toggle_click() {
                this.application.kopa.toggle(this.application.selected)
            },
            this_keydown_esc(event) {
                if (this.application.squadAnalyzer.isAnalyzing()) {
                    this.application.squadAnalyzer.reset()
                    event.stopPropagation()
                    event.preventDefault()
                }
            },
            marker_click(kopnik, event) {
                this.application.selected = kopnik
                return false
            },
            marker_dblclick(kopnik, event) {
                this.application.analyzeSquad(kopnik)
                return false
            },
            async map_updateBounds(event) {
                // await Kopnik.fetchApi("list")
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
<style>
    .map_kopnik-avatar {
        border-radius: 50%;
        border: solid 2px black;
        background-color: white;
    }
</style>
