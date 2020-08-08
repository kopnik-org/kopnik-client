<template>
    <v-container k-main ref="main"
                 fluid class="fill-height pa-0"
                 @keyup.esc="this_keydown_esc">
        <!-- zoom-control передается дальшее в options LMap, а они не реактиные, поэтому сразу нужно ставить true-->
        <MapVue ref="map" :center.sync="value.map.center" :zoom.sync="value.map.zoom" :bounds.sync="value.map.bounds"
                :layers-control="application.user"
                :locate-control="application.user"
                :scale-control="application.user"
                :zoom-control="true"
                @ready="map_ready"
                @click="map_click"
                @zoomstart="value.abortLoadTop20()"
                @movestart="value.abortLoadTop20()"
                @update:center="map_updateCenter"
                @update:zoom="map_updateZoom"
                @update:bounds="map_updateBounds"

                style="z-index: 0"
        >
            <!--            скрыть копные связи-->
            <l-control position="topright">
                <div v-if="value.squadAnalyzer.isAnalyzing() && value.squadAnalyzer.analyzed.length>1"
                     class="d-flex flex-column align-center">
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
            <!--                стрелка на конце-->

            <template v-for="eachArrow of arrows" v-if="eachArrow.isVisible">
<!--                <vue2-leaflet-polyline-decorator
                        :paths="[eachArrow.from, eachArrow.to]"
                        :patterns="eachArrow.patterns">
                </vue2-leaflet-polyline-decorator>-->
                <!--                видимая линия-->
                <l-polyline :key="'polyline'+eachArrow.key"
                            :lat-lngs="[eachArrow.from, eachArrow.to]"
                            :weight="eachArrow.weight"
                            :color="eachArrow.color"
                            :className="'arrow '+eachArrow.className"
                            :opacity="0.5"
                >
                </l-polyline>
                <!-- невидимая линия большой ширины, которая ловит mouseover -->
                <!--                <l-polyline v-if="eachArrow.weight<10" :key="'hoverHandler'+eachArrow.from.id"
                                            :lat-lngs="[eachArrow.from.location, eachArrow.to.location]"
                                            :weight="10"
                                            :opacity="0">
                                    <l-tooltip :options="{sticky:true}">{{eachArrow.tooltip}}</l-tooltip>
                                </l-polyline>-->
            </template>
            <!--            копники-->

            <!-- bubblingMouseEvents прекращает пропагацию событий на карту, также см  https://leafletjs.com/reference-1.6.0.html#domevent-stoppropagation -->
            <!--            <l-circle
                                v-for="(eachMarker) of markers" :key="'marker'+eachMarker.value.id"
                                :bubblingMouseEvents="false"
                                :radius="eachMarker.value.rank*100"
                                color="red"
                                :lat-lng="eachMarker.value.location"
                                :zIndexOffset="eachMarker.zIndex"
                                @click="marker_click($event, eachMarker.value)"
                                @dblclick="marker_dblclick($event, eachMarker.value, )"
                        >
                            <img :src="eachMarker.icon.iconUrl"/>
                        </l-circle>-->
            <l-marker v-for="(eachMarker) of markers" :key="'marker'+eachMarker.value.id"
                      :lat-lng="eachMarker.value.location"
                      :zIndexOffset="eachMarker.zIndex"
                      @dblclick="marker_dblclick(eachMarker.value)"
                      @click="marker_click(eachMarker.value)"
                      :icon="eachMarker.icon"
            >
                <l-tooltip v-if="!isTouchDevice" :options="{}">
                    <template v-if="env==='development'">{{eachMarker.value.id}} [{{eachMarker.iconSize}}px]</template>
                    {{eachMarker.value.rankName}}
                </l-tooltip>
            </l-marker>
        </MapVue>
        `
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

        <!--детали копник внизу-->
        <v-bottom-sheet v-if="application.user" :value="value.selected" :attach="$refs.main"
                        persistent hide-overlay no-click-animation :retain-focus="false" :inset="true"
        >
            <v-card class="text-center" height="150px">
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
                    <v-btn text :disabled="application.user===value.selected" class="flex"
                           @click="foreman_click">
                        {{
                        application.user.foreman===value.selected?$t('details.resetForeman'):application.user.foremanRequest===value.selected?$t('details.cancelForemanRequest'):$t('details.toForeman')}}
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
        LControl,
        LCircle,
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
    const
        TSAR_RANK = 5170,
        TOOLTIP_ARROW_WITH = 10,
        // размер маркера на последнем 18 приближении
        // MARKER_SIZE_18 = 48,
        MARKER_SIZE_18 = 64,
        MIN_MARKER_SIZE = 8,
        // размер, после которого маркер скрывается
        MAX_MARKER_SIZE = 128,
        ARROW_WEIGHT_18 = MARKER_SIZE_18 / 4,
        MIN_ARROW_WEIGHT = MIN_MARKER_SIZE / 4,
        /*
         * коэффициент недонаполненности сети 1.0 < K < 1.5 (рассчитывается таким образом: царь на первом масштабе занимает MARKER_SIZE_18 пикселей)
         * size = MARKER_SIZE_18 * Math.pow(TSAR_RANK, 1 / 3 * K) / Math.pow(2, 18 - this.value.map.zoom)
         * MARKER_SIZE_18 = MARKER_SIZE_18 * Math.pow(TSAR_RANK, K / 3) / Math.pow(2, 17)
         * Math.pow(2, 17) = Math.pow(TSAR_RANK, K / 3)
         * Math.pow(2, 51) = Math.pow(TSAR_RANK, K)
         * K = log _TSAR_RANK_ Math.pow(2, 51)
         */
        // K = 6500
        getBaseLog = (base, arg) => {
            return Math.log(arg) / Math.log(base)
        },
        K = Math.min(1.5, getBaseLog(TSAR_RANK, Math.pow(2, 51))),

        /**
         * Максимальный ранг копника, видимого на карте в данном приближении
         * size = MARKER_SIZE_18 * Math.pow(rank, 1 / 3 * K) / Math.pow(2, 18 - this.value.map.zoom)
         * MAX_MARKER_SIZE = MARKER_SIZE_18 * Math.pow(MAX_RANK, K / 3) / Math.pow(2, 18 - zoom)
         * Math.pow(MAX_RANK, K / 3) = MAX_MARKER_SIZE / MARKER_SIZE_18 * Math.pow(2, 18 - zoom)
         * MAX_RANK = Math.pow(MAX_MARKER_SIZE / MARKER_SIZE_18 * Math.pow(2, 18 - zoom), 3 / K)
         */
        getMaxKopnikRank = (zoom) => Math.min(300000000, Math.pow(MAX_MARKER_SIZE / MARKER_SIZE_18 * Math.pow(2, 18 - zoom), 3 / K))


    export default {
        mixins: [touchDetector, logger],
        components: {
            LCircle,
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
                icon: L.icon({
                    iconUrl: 'https://sun9-56.userapi.com/c639321/v639321874/53f61/8HqRXdrg-BM.jpg?ava=1',
                    iconSize: [32, 37],
                    iconAnchor: [16, 37]
                }),
                iconSize: 64,
                env: container.env,
                application: container.application,
                /**
                 * @type {Main}
                 */
                value: container.application.sections.main
            }
        },
        props: {
            dynamicSize() {
                return [this.iconSize, this.iconSize * 1.15];
            },
            dynamicAnchor() {
                return [this.iconSize / 2, this.iconSize * 1.15];
            },
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
            visibleKopniks() {
                const result = new Set([...this.value.top20, ...this.value.squadAnalyzer.analyzed])
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
                    .map(eachVisibleKopnik => {
                        const size = Math.max(MIN_MARKER_SIZE, Math.round(MARKER_SIZE_18 * Math.pow(eachVisibleKopnik.rank, 1 / 3 * K) / Math.pow(2, 18 - this.value.map.zoom)))
                        const isVisible = size < MAX_MARKER_SIZE
                        return {
                            value: eachVisibleKopnik,
                            size,
                            // size: MIN_MARKER_SIZE,
                            // icon: L.divIcon({
                            icon: L.icon({
                                iconUrl: eachVisibleKopnik.smallPhoto,
                                iconSize: [size, size],
                                iconAnchor: [size / 2, size / 2],
                                className: 'map_avatar' + (this.application.user === eachVisibleKopnik ? ' map_avatar-user' : '') + (this.value.selected === eachVisibleKopnik ? ' map_avatar-selected' : '') + (isVisible ? '' : ' map_avatar-oversized'),
                            }),
                            zIndex: this.value.selected === eachVisibleKopnik ? Number.MAX_SAFE_INTEGER : eachVisibleKopnik.rank * 1000,
                            isVisible, // это свойство используется внутри computed.arrows()
                        }
                    })
                // не делаем чтобы превышающие размер маркеры CSS-растворялись за то время пока завершится fetch новых маркеров, в котором их уже не будет
                // .filter(by MARKER_MAX_SIZE)
                // console.log(result)
                return result
            },
            arrows() {
                const zoom = this.value.map.zoom
                const squadAnalyzer = this.value.squadAnalyzer
                const result = squadAnalyzer.analyzed
                    // оставляем только копников у которые старшины проанализирован
                    .filter(eachAnalyzed => eachAnalyzed.foreman && squadAnalyzer.isAnalyzed(eachAnalyzed.foreman))
                    // стрелка идет от младшего к старшему
                    .map(eachMember => {
                        const markerFrom = this.markers.find(eachMarker => eachMarker.value === eachMember)
                        const markerTo = this.markers.find(eachMarker => eachMarker.value === eachMember.foreman)
                        const isVisible = markerFrom.isVisible
                        const color = eachMember === this.value.selected ? 'red' : 'blue'
                        const weight = Math.max(MIN_ARROW_WEIGHT, Math.round(ARROW_WEIGHT_18 * Math.pow(eachMember.rank, 1 / 3 * K) / Math.pow(2, 18 - zoom)))
                        const eachArrow = {
                            key: eachMember.id,
                            color,
                            weight,
                            visible: isVisible,
                            tooltipWidth: TOOLTIP_ARROW_WITH,
                            from: new L.latLng(eachMember.location),
                            to: new L.latLng(eachMember.foreman.location),
                            tooltip: eachMember.rankName + ' ⇨ ' + eachMember.foreman.rankName,
                            className: isVisible ? '' : ' map_avatar-oversized',
                            patterns: [
                                // defines a pattern of 10px-wide dashes, repeated every 20px on the line
                                {
                                    offset: Math.round(markerFrom.size / 2),
                                    endOffset: Math.round(markerTo.size / 2),
                                    repeat: weight*4,
                                    // repeat: (weight * 1) + 'px',
                                    // repeat: '100%',
                                    symbol: L.Symbol.arrowHead({
                                        pixelSize: weight,
                                        polygon: true,
                                        pathOptions: {
                                            color,
                                            stroke: false,
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
            /*            'application.user': async function (current) {
                            if (current && current.status !== Kopnik.Status.NEW) {
                                await this.value.loadTop20(getMaxRank(this.value.map.zoom))
                            }
                        },*/
            /**
             *
             * @param {Kopnik} current
             * @param {Kopnik} old
             */
            'value.selected': function (current, old) {

            },
        },
        methods: {
            // вызывается раньше чем зумм:апдейт. пробую здесь стоит начать перерисовку ширин стрелок
            map_zoomend(event) {
                /*                // задержка
                                for (let x = 0; x < 50000000; x++) {
                                    const y = Math.log2(Math.random())
                                }*/
                this.value.map.earlyZoom = event.target.getZoom()
                console.log('earlyZoom', this.value.map.earlyZoom)
            },
            /**
             * Позвать копника в беседу
             */
            talk_click() {
                this.application.errors.push(this.application.getMessage('errors.underConstruction'))
            },
            /**
             * Подать заявку на выбор копника своим старшиной
             * или отменить такую заявку
             * или выйти из подчинения старшины
             */
            async foreman_click() {
                const application = container.application
                const user = application.user

                if (await this.application.forwardUserToBeConfirmed()) {
                    return
                }

                // снять старшину
                if (user.foreman === this.value.selected) {
                    await user.resetForeman()
                    application.infos.push(application.getMessage("details.resetForemanInfo"))
                }
                // отменить заявку
                else if (user.foremanRequest === this.value.selected) {
                    await user.putForemanRequest(null)
                    application.infos.push(application.getMessage("details.cancelForemanRequestInfo"))
                }
                // оставить заявку
                else {
                    await user.putForemanRequest(this.value.selected)
                    application.infos.push(application.getMessage("details.toForemanInfo"))
                }
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
            toggle_click() {
                // this.value.kopa.stupidAdd(this.value.selected)
                this.value.kopa.toggle(this.value.selected)
            },
            this_keydown_esc(event) {
                if (this.value.squadAnalyzer.isAnalyzing()) {
                    this.value.squadAnalyzer.reset()
                }
            },
            map_click() {
                this.value.selected = null
            },
            marker_click(kopnik,) {
                this.value.selected = kopnik
            },
            async marker_dblclick(kopnik,) {
                if (await this.application.forwardUserToBeConfirmed()) {
                    return false
                }
                await this.value.squadAnalyzer.analyzeAround(kopnik)
                return false
            },
            /**
             *
             * @param {Map} event
             * @returns {Promise<void>}
             */
            async map_ready(event) {
                // await this.value.loadTop20()
            },
            async map_updateCenter(event) {
                this.value.setMapCenter(event)
            },
            async map_updateZoom(event) {
                this.value.setMapZoom(event)
            },
            async map_updateBounds(event) {
                await this.value.loadTop20(getMaxKopnikRank(this.value.map.zoom))
            },
        },
        created() {
        },
        async mounted() {
            await this.$nextTick()
            this.lmap = this.$refs.map.$refs.map.mapObject
            await this.application.resolveUser()

            console.log("Коэффициент недонаполненности сети К", K)
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

    .map_avatar-oversized {
        opacity: 0;
        visibility: hidden;
        transition: opacity 500ms, visibility 0ms linear 500ms;
    }
</style>
