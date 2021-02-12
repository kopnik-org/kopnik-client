<template>
  <v-container k-main ref="main"
               fluid class="fill-height pa-0"
               @keyup.esc="this_keydown_esc">
    <!-- zoom-control передается дальшее в options LMap, а они не реактиные, поэтому сразу нужно ставить true-->
    <MapVue ref="map" key="main_map"
            :center.sync="value.map.center" :zoom.sync="value.map.zoom" :bounds.sync="value.map.bounds"
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
      <!--      v-if до тех пор пока не заработает style:hidden на стрелке-->
      <template v-for="eachArrow of arrows" v-if="eachArrow.isVisible">
        <template v-if="antPath!==true">
          <vue2-leaflet-polyline-decorator :key="'decorator'+eachArrow.key"
                                           :paths="eachArrow.latLngs"
                                           :patterns="eachArrow.patterns">
          </vue2-leaflet-polyline-decorator>
          <l-polyline :key="'polyline'+eachArrow.key"
                      :lat-lngs="eachArrow.latLngs"
                      :weight="eachArrow.weight"
                      :color="eachArrow.color"
                      :className="'arrow '+eachArrow.className"
                      :opacity="0.5"
                      @click="arrow_click(eachArrow, $event)"
                      @dblclick="arrow_dblclick(eachArrow, $event)"
          >
          </l-polyline>
        </template>

        <!--        https://github.com/rubenspgcavalcante/leaflet-ant-path#parameters-->
        <vue2-ant-path v-else :key="'antPath'+eachArrow.key"
                       :paths="eachArrow.latLngs"
                       :options="eachArrow.antOptions"
                       @click="arrow_click(eachArrow, $event)"
                       @dblclick="arrow_dblclick(eachArrow, $event)"
        >
        </vue2-ant-path>
      </template>
      <!--            копники-->


      <l-marker v-for="(eachMarker) of markers" :key="'marker'+eachMarker.value.id"
                :lat-lng="eachMarker.value.location"
                :zIndexOffset="eachMarker.zIndex"
                @dblclick="marker_dblclick(eachMarker.value, $event)"
                @click="marker_click(eachMarker.value, $event)"
                :icon="eachMarker.icon"
                title="asdfas"
      >
        <l-tooltip v-if="!isTouchDevice" :options="{}">
          <template v-if="env==='development'">{{ eachMarker.size }}x{{ eachMarker.size }} id:{{
              eachMarker.value.id
            }}
          </template>
          {{ eachMarker.value.rankName }}
        </l-tooltip>
      </l-marker>
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
    </MapVue>

    <!--        копники на копу-->
    <kopa-invite v-if="kopa.participants.length" :value="kopa"
                 style="position: fixed; left: 50%; transform: translateX(-50%); transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);"
                 :style="{bottom: kopaBottom}"
                 @avatar_click="avatar_click($event)" @avatar_dblclick="avatar_dblclick($event)">
      <v-dialog ref="kopaDialog"
                v-model="kopaDialog"
                :max-width="450"
      >
        <!--         кнопка-активатор-->
        <template v-slot:activator="{ on, attrs }">
          <v-btn ref="kopaAsk" fab small color="primary"
                 title="Созвать всех на копу..."
                 v-on="on"
                 class="ml-auto mr-1 mb-2" width="52" height="52">
            <v-icon>mdi-handshake</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <v-avatar :size="128" class="mr-7"><img src="img/avatar.png"></v-avatar>
            {{ $t('kopaDialog.title') }}
          </v-card-title>
          <v-card-text>
            <v-textarea
              :rows="3"
              :label="$t('kopaDialog.subject.label')" v-model="kopa.subject"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn ref="kopaDialogOK" text color="primary" @click="kopaDialogOK_click" :disabled="!kopa.subject"
                   class="flex-grow-1"
                   v-promise-btn
            >
              {{ $t('dialog.yes') }}
            </v-btn>
            <v-btn ref="kopaDialogCancel" text color="secondary" @click="kopaDialog=false" class="flex-grow-1"
                   v-promise-btn
            >
              {{ $t('dialog.no') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </kopa-invite>

    <!--детали копник внизу-->
    <v-bottom-sheet v-if="application.user" ref="details" :value="value.selected" :attach="$refs.main"
                    persistent hide-overlay no-click-animation :retain-focus="false" :inset="true"
    >
      <v-card class="text-center" height="150px">
        <v-list-item v-if="value.selected">
          <k-avatar :value="value.selected" :size="80" class="ma-3 ml-0"
                    @dblclick="avatar_dblclick(value.selected)">
          </k-avatar>
          <v-list-item-content class="pl-5">
            <div class="">{{ value.selected.name }} </div>
            <v-list-item-subtitle class="">{{ selectedRole }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions
          v-if="value.selected"
          class="flex-nowrap"
        >
          <v-btn ref="toggleParticipant" text :disabled="application.user===value.selected || !isSelectedKopnik || !isUserKopnik" class="flex"
                 @click="toggle_click">
            {{ value.kopa.isParticipantAdded(value.selected) ? $t('details.notToKopa') : $t('details.toKopa') }}
          </v-btn>
          <!--         диалоги старшин-->
          <v-dialog ref="foremanDialog"

                    v-model="foremanDialog"
                    :max-width="450"
          >
            <!--         кнопка-активатор-->
            <template v-slot:activator="{ on, attrs }">
              <v-btn ref="foremanAsk" text :disabled="application.user===value.selected || !isSelectedKopnik || !(isUserKopnik || isUserFutureKopnik)" class="flex"
                     v-bind="attrs"
                     v-on="on"
                     v-promise-btn
              >
                {{
                  application.user.foreman === value.selected ? $t('details.resetForeman') : application.user.foremanRequest === value.selected ? $t('details.cancelForemanRequest') : $t('details.toForeman')
                }}
              </v-btn>
            </template>

            <!--         Больше не старшина -->
            <v-card>
              <v-card-title>
                <k-avatar :value="value.selected" :size="128" class="mr-7"></k-avatar>
                {{
                  application.user.foreman === value.selected ? $t('details.resetForemanQuestion') : application.user.foremanRequest === value.selected ? $t('details.cancelForemanRequestQuestion') : $t('details.toForemanQuestion')
                }}
              </v-card-title>
              <v-card-text>
                {{ $t('definitions.foreman') }}
              </v-card-text>
              <v-card-actions>
                <v-btn ref="foremanConfirm" text color="primary" @click="foreman_click" class="flex-grow-1"
                       v-promise-btn
                >
                  {{ $t('dialog.yes') }}
                </v-btn>
                <v-btn ref="foremanDecline" text color="secondary" @click="foremanDialog=false" class="flex-grow-1"
                       v-promise-btn
                >
                  {{ $t('dialog.no') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>
<script>
import L, {LatLng, LatLngBounds, Map, DomEvent} from 'leaflet'
import AntPath from 'leaflet-ant-path'
import {
  LPolyline,
  LTooltip,
  LIcon,
  LMarker,
  LControl,
  LCircle,
} from 'vue2-leaflet'
import {Kopa, Kopnik} from "../models"
import MapVue from "./MapVue";
import {container} from "@/bottle/bottle";
import Vue2LeafletPolylineDecorator from 'vue2-leaflet-polylinedecorator'
import touchDetector from "./mixin/touch-detecter";
import logger from "./mixin/logger";
import KopaInvite from "./KopaInviteVue";
import KAvatar from "./KAvatar";
import Main from "../application/Main";
import Vue2AntPath from "@/components/Vue2AntPath";
import isTouchDevice from "@/components/isTouchDevice";
import KopnikVue from "@/components/KopnikVue";


// На 18-ом увеличении
const
  // коэффициент уменьшения связи относительно личной силы
  K_SVAZI = 1,
  // максимальный ранг системы (заполнить для расчета коэффициента недонаполненности сети)
  TSAR_RANK = 8059,
  TOOLTIP_ARROW_WITH = 10,
  // размер маркера на последнем 18 приближении
  // MARKER_SIZE_18 = 48,
  MARKER_SIZE_18 = 64,
  MIN_MARKER_SIZE = 8,
  // размер, после которого маркер скрывается
  MAX_MARKER_SIZE = 128,
  ARROW_WEIGHT_18 = MARKER_SIZE_18 / K_SVAZI,
  MIN_ARROW_WEIGHT = MIN_MARKER_SIZE / K_SVAZI,
  // минимальный размер стрелочки внутри копной связи
  MIN_DECORATOR_SIZE = MIN_ARROW_WEIGHT * 2,
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
  getMaxKopnikRank = (zoom) => Math.floor(Math.min(300000000, Math.pow(MAX_MARKER_SIZE / MARKER_SIZE_18 * Math.pow(2, 18 - zoom), 3 / K)))


export default {
  mixins: [touchDetector, logger],
  components: {
    KopnikVue,
    Vue2AntPath,
    LCircle,
    KAvatar: KAvatar,
    KopaInvite,
    Vue2LeafletPolylineDecorator,
    LPolyline,
    LMarker,
    LControl,
    LIcon,
    LTooltip,
    MapVue,
  },
  data() {
    return {
      foremanDialog: false, // это признак все диалоги старшины. они все внутри одного диалога
      kopaDialog: false, // это признак диалога копы
      antPath: true, // !isTouchDevice(),
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
    isUserFutureKopnik(){
      return this.application.user.role==Kopnik.Role.FutureKopnik
    },
    isUserKopnik(){
      return this.application.user.role==Kopnik.Role.Kopnik || this.application.user.role==Kopnik.Role.DanilovKopnik
    },
    isSelectedKopnik(){
      return this.application.sections.main.selected.role==Kopnik.Role.Kopnik || this.application.sections.main.selected.role==Kopnik.Role.DanilovKopnik
    },
    selectedRole() {
      return this.$t(`profile.roles[${this.application.sections.main.selected.role-1}].title`)
    },
    kopa() {
      return this.application.sections.main.kopa
    },
    loadedKopniks() {
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
      const result = this.loadedKopniks
        .map(eachVisibleKopnik => {
          const size = Math.max(MIN_MARKER_SIZE, Math.round(MARKER_SIZE_18 * Math.pow(eachVisibleKopnik.rank, 1 / 3 * K) / Math.pow(2, 18 - this.value.map.zoom)))
          const isVisible = size < MAX_MARKER_SIZE
          return {
            value: eachVisibleKopnik,
            size,
            // size: MIN_MARKER_SIZE,
            // icon: L.divIcon({
            icon: L.icon({
              iconUrl: eachVisibleKopnik.photo,
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
        .map(eachAnalyzed => {
          const markerFrom = this.markers.find(eachMarker => eachMarker.value === eachAnalyzed)
          const markerTo = this.markers.find(eachMarker => eachMarker.value === eachAnalyzed.foreman)
          const isVisible = markerFrom.isVisible
          const color = eachAnalyzed === this.value.selected ? 'red' : 'blue'
          const weight = Math.max(MIN_ARROW_WEIGHT, Math.round(markerFrom.size / K_SVAZI))
          const eachArrow = {
            key: eachAnalyzed.id,
            color,
            weight,
            isVisible,
            tooltipWidth: TOOLTIP_ARROW_WITH,
            from: eachAnalyzed,
            to: eachAnalyzed.foreman,
            latLngs: [new L.latLng(eachAnalyzed.location), new L.latLng(eachAnalyzed.foreman.location)],
            tooltip: eachAnalyzed.rankName + ' ⇨ ' + eachAnalyzed.foreman.rankName,
            className: isVisible ? ' ' : ' map_avatar-oversized',
            patterns: [
              // defines a pattern of 10px-wide dashes, repeated every 20px on the line
              {
                offset: Math.round(markerFrom.size) * 2,
                endOffset: Math.round(markerTo.size),
                repeat: '256px',
                // repeat: weight * 10,
                // repeat: (weight * 1) + 'px',
                // repeat: '100%',
                symbol: L.Symbol.arrowHead({
                  pixelSize: Math.max(weight, MIN_DECORATOR_SIZE),
                  polygon: true,
                  pathOptions: {
                    color,
                    stroke: false,
                    fillOpacity: 1,
                  }
                })
              },
            ],
            antOptions: {
              color: color,
              delay: 2500,
              weight: weight,
              hardwareAccelerated: true,
              dashArray: [weight * 1.5, weight * 5],
              // paused: container.env !== 'production'
            }
          }
          return eachArrow
        })
      return result
    }
  },
  watch: {
    'application.user': async function (current) {
      if (current && this.value.map.bounds) {
        await this.value.loadTop20(getMaxKopnikRank(this.value.map.zoom))
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
    kopaDialogOK_click: async function () {
      await this.application.user.inviteKopa(this.application.sections.main.kopa)
      this.application.sections.main.kopa = new Kopa()
      this.kopaDialog = false
      this.application.infos.push(this.application.getMessage("kopaDialog.afterInfo"))
    },
    arrow_click(arrow, event) {
      this.value.selected = this.value.selected === arrow.from ? arrow.to : arrow.from
      DomEvent.stopPropagation(event)
    },
    arrow_dblclick(arrow, event) {
      DomEvent.stopPropagation(event)
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
      try {
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
      } finally {
        this.foremanDialog = false
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
      this.value.kopa.toggleParticipant(this.value.selected)
    },
    this_keydown_esc(event) {
      if (this.value.squadAnalyzer.isAnalyzing()) {
        this.value.squadAnalyzer.reset()
      }
    },
    map_click() {
      this.value.selected = null
    },
    marker_click(kopnik, event) {
      this.value.selected = kopnik
    },
    async marker_dblclick(kopnik, event) {
      if (await this.application.forwardUserToBeConfirmed()) {
        return false
      }
      await this.value.squadAnalyzer.analyzeAround(kopnik)
      DomEvent.stopPropagation(event)
      // DomEvent.preventDefault(event)
      // return false
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
    // эта проверка нужна потому что в тестах компонент карты мокается
    if (this.$refs.map && this.$refs.map.$refs.map) {
      this.lmap = this.$refs.map.$refs.map.mapObject
      await this.application.resolveUser()
    }

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
  border: solid 2px blue;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px, rgba(0, 0, 0, 0.14) 0 6px 10px 0, rgba(0, 0, 0, 0.12) 0 1px 9px 0;
}

.map_avatar-user {
  /*border-color: rgb(255,0,0);*/
  /*двойной*/
  box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px, rgba(0, 0, 0, 0.14) 0 6px 10px 0, rgba(0, 0, 0, 0.12) 0 1px 9px 0;
}

.map_avatar-selected {
  border-color: red;
}

.map_avatar-oversized {
  opacity: 0;
  visibility: hidden;
  transition: opacity 500ms, visibility 0ms linear 500ms;
}
</style>
