<template>
    <v-container k-main ref="main"
                 fluid class="fill-height pa-0"
                 @keyup.esc="this_keydown_esc">
        <!-- zoom-control передается дальшее в options LMap, а они не реактиные, поэтому сразу нужно ставить true-->
        <MapVue ref="map" :center.sync="center" :zoom.sync="zoom"
                :layers-control="application.user"
                :locate-control="application.user"
                :scale-control="application.user"
                :zoom-control="true"
                storage-key="MainVue.map"
                @update:bounds="map_updateBounds"
                style="z-index: 0"
                @click="application.selected=null"
        >
            <!--            скрыть копные связи-->
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
            <!--            копные связи-->
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
            <!--            копники-->
            <l-marker v-for="(eachMarker) of markers" :key="'marker'+eachMarker.value.id"
                      :lat-lng="eachMarker.value.location"
                      :zIndexOffset="eachMarker.zIndex"
                      @dblclick="marker_dblclick(eachMarker.value, $event)"
                      @click="marker_click(eachMarker.value, $event)"
            >
                <l-icon
                        :icon-size="[eachMarker.size, eachMarker.size]"
                        :icon-anchor="[eachMarker.size/2,eachMarker.size/2]"
                        :class-name="eachMarker.className"
                        icon-url="avatar.png">
                </l-icon>
                <l-tooltip v-if="!isTouchDevice" :options="{}">{{eachMarker.value.rankName}}</l-tooltip>
                <!--                <l-popup>l-popup!</l-popup>-->
            </l-marker>

        </MapVue>

        <!--        копники на копу-->
        <transition name="kopa">
            <kopa-invite v-if="application.kopa.parts.length" :value="application.kopa"
                         style="position: fixed; left: 50%; transform: translateX(-50%)"
                         :style="{bottom: kopaBottom}"
                         @avatar_click="avatar_click($event)" @avatar_dblclick="avatar_dblclick($event)">
                <v-btn fab small color="primary"
                       title="Созвать всех на копу..."
                       @click="inviteAll_click"
                       class="ml-auto mr-1 mb-2" width="48" height="48">
                    <v-icon>mdi-handshake</v-icon>
                </v-btn>
            </kopa-invite>
        </transition>
        <!--        копник внизу-->
        <v-bottom-sheet :value="application.selected" :attach="$refs.main"
                        persistent hide-overlay no-click-animation :retain-focus="false" :inset="true"
                        @input="details_input"
        >
            <v-card>
                <v-list-item v-if="application.selected">
                    <v-badge :content="application.selected.rank" bottom color="orange" :offset-x="50" :offset-y="30">
                        <v-list-item-avatar left :size="80" @dblclick="avatar_dblclick(application.selected)">
                            <v-img :src="application.selected.photo"></v-img>
                        </v-list-item-avatar>
                    </v-badge>
                    <v-list-item-content>
                        <v-list-item-subtitle class="text-wrap">{{application.selected.name}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-card-actions class="flex-nowrap">
                    <v-btn text :disabled="application.user===application.selected" class="flex">
                        В беседу
                    </v-btn>
                    <v-btn text :disabled="application.user===application.selected" class="flex" @click="toggle_click">
                        {{application.kopa.isAdded(application.selected)?'Не звать':'На копу'}}
                    </v-btn>
                    <v-btn text :disabled="application.user===application.selected" class="flex">
                        В старшины
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
    </v-container>
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
        MIN_MARKER_SIZE = 36

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
                info: null,
            }
        },
        computed: {
            kopaBottom() {
                if (this.application.selected) {
                    return '155px'
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
                            className: 'map_avatar' + (this.application.user === eachTop ? ' map_avatar-user' : '') + (this.application.selected === eachTop ? ' map_avatar-selected' : ''),
                            zIndex: this.application.selected == eachTop ? Number.MAX_SAFE_INTEGER : eachTop.rank * 1000,
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
            }
        },
        watch: {
            'application.user': async function (current, old) {
                if (current) {
                    await this.application.loadTop20()
                }
            },
            /**
             *
             * @param {Kopnik} current
             * @param {Kopnik} old
             */
            'application.selected': function (current, old) {

            },
        },
        methods: {
            /**
             * @param {Kopnik} event
             */
            avatar_click(event) {
                this.application.selected = event
            },
            /**
             * @param {Kopnik} event
             */
            avatar_dblclick(event) {
                this.provideKopnikVisibility(event)
                return false
            },
            /**
             * @param {Kopnik} kopnik
             */
            provideKopnikVisibility(kopnik) {
                if (!this.lmap.getBounds().contains(kopnik.location)) {
                    this.lmap.flyTo(kopnik.location)
                }
            },
            inviteAll_click() {
                this.application.kopa.inviteAll()
                this.application.infos.push('Приглашение на Копу отправлено')
            },
            details_input(event) {
                if (!event) {
                    this.application.selected = null
                }
            },
            toggle_click() {
                this.application.kopa.stupidAdd(this.application.selected)
                // this.application.kopa.toggle(this.application.selected)
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
                this.lmap = this.$refs.map.$refs.map.mapObject
            })
            await this.application.resolveUser()
        }
    }
</script>
<style>
    .k-kopaInvite {
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .k-kopaInvite .kopa-leave-to {
        opacity: 0;
    }

    .map_avatar {
        border-radius: 50%;
        border: solid 2px black;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 9px 0px;
    }

    .map_avatar-user {
        border-color: red;
    }

    .map_avatar-selected {
        border-color: blue;
    }
</style>
