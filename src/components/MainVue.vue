<template>
    <v-container k-main ref="main"
                 fluid class="fill-height pa-0"
                 @keyup.esc="this_keydown_esc">
        <!-- zoom-control передается дальшее в options LMap, а они не реактиные, поэтому сразу нужно ставить true-->
        <MapVue ref="map" :center.sync="value.map.center" :zoom.sync="value.map.zoom"
                :layers-control="application.user"
                :locate-control="application.user"
                :scale-control="application.user"
                :zoom-control="true"
                @ready="map_ready"
                @click="value.selected=null"
                @zoomstart="value.abortLoadTop20()"
                @movestart="value.abortLoadTop20()"
                @update:center="map_updateCenter"
                @update:zoom="map_updateZoom"
                @update:bounds="map_updateBounds"

                style="z-index: 0"


        >
            <!--            скрыть копные связи-->
            <l-control position="topright">
                <div v-if="value.squadAnalyzer.isAnalyzing()" class="d-flex flex-column align-center">
                    <v-btn fab small
                           title="Скрыть копные связи"
                           @click="this_keydown_esc"
                           style="order: -1000000000">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <!--                    <v-avatar v-for="eachMember of value.squadAnalyzer.members" :key="'avatar'+eachMember.id"
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
                        :icon-anchor="[eachMarker.size/2, eachMarker.size/2]"
                        :class-name="eachMarker.className"
                        :icon-url="eachMarker.value.smallPhoto">
                </l-icon>
                <l-tooltip v-if="!isTouchDevice" :options="{}">{{eachMarker.value.rankName}}</l-tooltip>
            </l-marker>
        </MapVue>

        <!--        копники на копу-->
        <kopa-invite v-if="value.kopa.parts.length" :value="value.kopa"
                     style="position: fixed; left: 50%; transform: translateX(-50%); transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);"
                     :style="{bottom: kopaBottom}"
                     @avatar_click="avatar_click($event)" @avatar_dblclick="avatar_dblclick($event)">
            <v-btn fab small color="primary"
                   title="Созвать всех на копу..."
                   @click="inviteAll_click"
                   class="ml-auto mr-1 mb-2" width="52" height="52">
                <v-icon>mdi-handshake</v-icon>
            </v-btn>
        </kopa-invite>

        <!--       детали копник внизу-->
        <v-bottom-sheet :value="value.selected" :attach="$refs.main"
                        persistent hide-overlay no-click-animation :retain-focus="false" :inset="true"
                        @input="details_input"
        >
            <v-card>
                <v-list-item v-if="value.selected">
                    <avatar-vue :value="value.selected" :size="80" class="ma-3 ml-0"
                                @dblclick="avatar_dblclick(value.selected)">
                    </avatar-vue>
                    <v-list-item-content>
                        <v-list-item-subtitle class="text-wrap">{{value.selected.name}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-card-actions class="flex-nowrap">
                    <v-btn text :disabled="application.user===value.selected" class="flex" @click="talk_click">
                        {{ $t('details.toChat') }}
                    </v-btn>
                    <v-btn text :disabled="application.user===value.selected" class="flex" @click="toggle_click">
                      {{ value.kopa.isAdded(value.selected)? $t('details.notToKopa'):$t('details.toKopa') }}
                    </v-btn>
                    <v-btn text :disabled="application.user===value.selected" class="flex" @click="setForeman_click">
                        {{ $t('details.toForeman') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
    </v-container>
</template>
<script>
    import L, {LatLng, LatLngBounds, Map} from 'leaflet'
    import {
        LPolyline,
        LTooltip,
        LIcon,
        LMarker,
        LControl
    } from 'vue2-leaflet'
    import {Kopnik} from "../models"
    import MapVue from "./MapVue";
    import {container} from "../bottle/bottle";
    import Vue2LeafletPolylineDecorator from 'vue2-leaflet-polylinedecorator'
    import touchDetector from "./mixin/touch-detecter";
    import logger from "./mixin/logger";
    import KopaInvite from "./KopaInviteVue";
    import AvatarVue from "./AvatarVue";
    import Main from "../application/Main";


    // На 18-ом увеличении
    const ARROW_WIDTH = 10,
        TOOLTIP_ARROW_WITH = 15,
        MARKER_SIZE = 48,
        MIN_MARKER_SIZE = 36

    export default {
        mixins: [touchDetector, logger],
        components: {
            AvatarVue,
            KopaInvite,
            Vue2LeafletPolylineDecorator,
            LPolyline,
            LMarker,
            LControl,
            LIcon,
            LTooltip,
            MapVue
        },
        data() {
            return {
                application: container.application,
                /**
                 * @type {Main}
                 */
                value: container.application.sections.main
            }
        },
        props: {
            /**
             * Автокомплит в разделе <template> не работает :(
             * По этой причине это свойство перенесено в свойство data
             */
            valueX: {
                type: Main,
                required: false,
            }
        },
        computed: {
            visibleKopniks(){
                const result= new Set([...this.value.top20, ...this.value.squadAnalyzer.members])
                if (this.application.user) {
                    result.add(this.application.user)
                }
                if (this.value.selected) {
                    result.add(this.value.selected)
                }
                return [...result]
            },
            kopaBottom() {
                if (this.value.selected) {
                    return '155px'
                } else {
                    return 0
                }
            },
            markers() {
                const result = this.visibleKopniks
                    .map(eachTop => {
                        return {
                            value: eachTop,
                            // size: Math.max(MIN_MARKER_SIZE, Math.round(MARKER_SIZE * Math.pow(eachTop.rank, 1 / 3) / Math.pow(2, 18 - this.value.map.zoom))),
                            size: MIN_MARKER_SIZE,
                            className: 'map_avatar' + (this.application.user === eachTop ? ' map_avatar-user' : '') + (this.value.selected === eachTop ? ' map_avatar-selected' : ''),
                            zIndex: this.value.selected === eachTop ? Number.MAX_SAFE_INTEGER : eachTop.rank * 1000,
                        }
                    })
                // console.log(result)
                return result
            },
            arrows() {
                const squadAnalyzer = this.value.squadAnalyzer,
                    result = squadAnalyzer.members
                        // стрелки идкт если старшина в исследованной части
                        .filter(eachMember => squadAnalyzer.members.indexOf(eachMember.foreman) !== -1)
                        // стрелка идет от младшего к старшему
                        .map(eachMember => {
                            let color = (eachMember === squadAnalyzer.starter || squadAnalyzer.foremans.includes(eachMember)) && squadAnalyzer.foremans.includes(eachMember.foreman) ? 'red' : 'blue',
                                width = Math.max(1, Math.round(ARROW_WIDTH * Math.pow(eachMember.rank, 1 / 3) / Math.pow(2, 18 - this.value.map.zoom))),
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
            'application.user': async function (current) {
                if (current) {
                    await this.value.loadTop20()
                }
            },
            /**
             *
             * @param {Kopnik} current
             * @param {Kopnik} old
             */
            'value.selected': function (current, old) {

            },
        },
        methods: {
            /**
             * Позвать копника в беседу
             */
            talk_click() {
                this.application.errors.push(this.application.getMessage('errors.underConstruction'))
            },
            /**
             * Выбрать копника старшиной
             */
            setForeman_click() {
                this.application.errors.push(this.application.getMessage('errors.underConstruction'))
            },
            /**
             * @param {Kopnik} event
             */
            avatar_click(event) {
                this.value.selected = event
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
                this.value.kopa.inviteAll()
                // this.application.infos.push('Приглашение на Копу отправлено')
            },
            details_input(event) {
                if (!event) {
                    this.value.selected = null
                }
            },
            toggle_click() {
                // this.value.kopa.stupidAdd(this.value.selected)
                this.value.kopa.toggle(this.value.selected)
            },
            this_keydown_esc(event) {
                if (this.value.squadAnalyzer.isAnalyzing()) {
                    this.value.squadAnalyzer.reset()
                    event.stopPropagation()
                    event.preventDefault()
                }
            },
            marker_click(kopnik) {
                this.value.selected = kopnik
                return false
            },
            marker_dblclick(kopnik) {
                this.value.analyzeSquad(kopnik)
                return false
            },
            async map_updateCenter(event) {
                this.value.setMapCenter(event)
            },
            /**
             *
             * @param {Map} event
             * @returns {Promise<void>}
             */
            async map_ready(event) {
                await this.value.setMapBounds(event.getBounds())
            },
            async map_updateZoom(event) {
                this.value.setMapZoom(event)
            },
            async map_updateBounds(event) {
                await this.value.setMapBounds(event)
            },
        },
        created() {
        },
        async mounted() {
            await this.$nextTick()
            this.lmap = this.$refs.map.$refs.map.mapObject
            await this.application.resolveUser()
        }
    }
</script>
<style>
    /*Баг хрома из-за скрываемой адресной строки*/
    .k-main .leaflet-touch .leaflet-control-container .leaflet-top {
        margin-top: 50px;
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
