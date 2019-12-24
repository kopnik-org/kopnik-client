<template>
    <div
            @keyup.esc="this_keydown_esc"
            style="align-self: stretch; margin: -12px;" class="flex-grow-1">
        <v-dialog v-model="details.show" max-width="300">
            <v-card>
                <kopnik-vue :value="details.value" @click="details_click"></kopnik-vue>
                <v-card-actions class="flex-wrap">
                    <v-btn text1 block>
                        Чат
                    </v-btn>
                    <div></div>
                    <v-btn text1 block class="mt-2">
                        В участники копы
                    </v-btn>
                    <div></div>
                    <v-btn text1 block class="mt-2" @click="details.show = true">
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
                style="z-index: 0"
        >
            <!--            <l-marker :lat-lng="center">
                            <l-icon
                                    :icon-size="[64, 64]"
                                    :icon-anchor="[32,32]"
                                    icon-url="logo circle.png">
                            </l-icon>
                        </l-marker>-->
            <vue2-leaflet-polyline-decorator v-for="eachArrow of arrows" :key="'arrow'+eachArrow.from.id"
                                             :paths="[eachArrow.from.location, eachArrow.to.location]"
                                             :patterns="eachArrow.patterns">
            </vue2-leaflet-polyline-decorator>
            <l-polyline v-for="eachArrow of arrows" :key="'line'+eachArrow.from.id"
                        :lat-lngs="[eachArrow.from.location, eachArrow.to.location]"
                        :weight="eachArrow.weight"
                        :color="eachArrow.color">
            </l-polyline>
            <!-- невидимая линия большой ширины, которая ловит mouseover -->
            <l-polyline v-for="eachArrow of arrows" :key="'tooltipLine'+eachArrow.from.id"
                        :lat-lngs="[eachArrow.from.location, eachArrow.to.location]"
                        :weight="10"
                        :opacity="0">
                <l-tooltip :options="{sticky:true}">{{eachArrow.tooltip}}</l-tooltip>
            </l-polyline>

            <l-marker v-for="(eachMarker) of markers" :key="'marker'+eachMarker.value.id"
                      :lat-lng="eachMarker.value.location"
                      :zIndexOffset="eachMarker.value.rank*1000"
                      @dblclick="marker_dblclick(eachMarker.value, $event)"
                      @click.right.exact="marker_click_right(eachMarker.value)"
            >
                <l-tooltip :options="{}">{{eachMarker.tooltip}}</l-tooltip>
                <!--                <l-popup>l-popup!</l-popup>-->
            </l-marker>
            <l-control position="topright">
                <div v-if="application.squadAnalyzer.isAnalyzing()" class="d-flex flex-column align-center">
                    <v-btn fab small
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

    const ARROW_WIDTH = 10,
        ARROW_TOOLTIP_WITH = 15

    export default {
        components: {
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
            markers() {
                const result = application.top20
                // добавил из исследуемой дружины всех кто не попал в экран чтобы стрелки продолжали рисоваться
                // .push(application.squadAnalyzer.members.filter(eachMember=>!application.top20.includes(eachMember)))
                    .sort((a, b) => a.rank < b.rank ? -1 : 1)
                    .map(eachTop => {
                        return {
                            value: eachTop,
                            tooltip: eachTop.name + (eachTop.rank > 1 ? ` (+${eachTop.rank})` : ''),
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
                                    tooltipWidth: ARROW_TOOLTIP_WITH,
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
            this_keydown_esc(event) {
                if (this.application.squadAnalyzer.isAnalyzing()) {
                    this.application.squadAnalyzer.reset()
                    event.stopPropagation()
                    event.preventDefault()
                }
            },
            marker_click_right(kopnik) {
                this.details.value = kopnik
                this.details.show = true
            },
            marker_dblclick(kopnik, event) {
                this.application.analyzeSquad(kopnik)
                event.originalEvent.stopPropagation()
            },
            async map_updateBounds(event) {
                // await Kopnik.fetchApi("list")
            },
            details_click() {
                this.details.show = false
            }
        },
        created() {
        },
        async mounted() {
            this.$nextTick(() => {
                // this.map= this.$refs.map.mapObject.setView([51.505, -0.09], 13)
            })
            await this.application.resolveUser()
            this.debouncedDetailsShow = _.debounce(() => {
                this.details.show = true
            }, 250)
        }
    }
</script>
