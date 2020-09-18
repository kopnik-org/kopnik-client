<template>
  <v-container fluid class="fill-height k-subordinates flex-column align-center">
    <!--    пользователь и его окружение-->
    <v-card elevation="12"
            class="pt-4 mb-10 d-flex flex-column align-content-stretch align-center"
            width="100%" max-width="350px"
    >
      <!--      старшина-->
      <v-badge v-if="value.foreman"
               :title="value.foreman.name"
               class='k-badge-event-handler' color="red" :offset-x="(64/64)*7+14" :offset-y="(64/64)*7+14"
      >
        <div slot="badge"
             ref="resetForemanAsk"
             :title="$t('details.resetForeman')" style="cursor: pointer"
             @click="resetForemanAsk_click"
        >
          x
        </div>
        <!--аватарка старшины-->
        <KAvater ref="foreman"
                   :value="value.foreman"
                   :size="64" class="mb-2">
        </KAvater>
      </v-badge>

      <!--      снять старшину-->
      <v-dialog ref="resetForemanDialog"
                v-model="resetForemanDialog"
                :max-width="450"
      >
        <v-card>
          <v-card-title>
            <k-avater v-if="value.foreman" :value="value.foreman" :size="128" class="mr-7"></k-avater>
            {{ $t('details.resetForemanQuestion') }}
          </v-card-title>
          <v-card-text>
            {{ $t('definitions.foreman') }}
          </v-card-text>
          <v-card-actions>
            <v-btn ref="resetForemanConfirm"
                   text color="primary" @click="resetForeman_click" class="flex-grow-1"
                   v-promise-btn
            >
              {{ $t('dialog.yes') }}
            </v-btn>
            <v-btn text color="secondary" @click="resetForemanDialog=false" class="flex-grow-1"
                   v-promise-btn
            >
              {{ $t('dialog.no') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--      стрелка к старшине-->
      <v-icon v-if="value.foreman" :color="value.foreman?'red':'#CCC'" size="250"
              style="margin-top: -25px; margin-bottom: -80px">
        mdi-arrow-up-bold
      </v-icon>

      <!--      пользователь -->
      <KAvater ref='user'
                 :value="value"
                 :size="64" class="mb-2">
      </KAvater>

      <!--      стрелка к пользователю-->
      <v-icon :color="(value.subordinates && value.subordinates.length)?'blue':'#CCC'"
              :size="(((value.rank===1?2:value.rank)-1)/value.rank)*250"
              style="margin-top: -25px; margin-bottom: -80px">
        mdi-arrow-up-bold
      </v-icon>

      <!--      подчиненные пользователя -->
      <div class="d-flex flex-wrap mt-2 justify-space-around">
        <template v-for="(eachSubordinate, eachSubordinateIndex) of extendedSubordinates">
          <v-badge v-if="eachSubordinate"
                   :key="'reset_'+eachSubordinate.id"
                   :title="eachSubordinate.name"
                   class='k-badge-event-handler' color="red" :offset-x="(64/64)*7+14" :offset-y="(64/64)*7+14"
          >
            <!--крестик-->
            <div slot="badge" ref="removeFromSubordinatesAsk"
                 :title="$t('subordinates.removeFromSubordinates')" style="cursor: pointer"
                 @click="removeFromSubordinatesAsk_click(eachSubordinate)"
            >
              x
            </div>
            <!--аватарка-->
            <KAvater ref='subordinate'
                       :value="eachSubordinate"
                       :size="64" class="mb-2">
            </KAvater>
          </v-badge>
          <v-avatar v-else :key="'empty_'+eachSubordinateIndex"
                    :size="64" class="mb-2">
            <v-icon :size="64">mdi-account</v-icon>
          </v-avatar>
        </template>
      </div>

      <!--      исключить из подчиненных-->
      <v-dialog ref="removeFromSubordinatesDialog"
                v-model="removeFromSubordinatesDialog"
                :max-width="450"
      >
        <v-card>
          <v-card-title>
            <k-avater v-if="removeFromSubordinatesCandidate" :value="removeFromSubordinatesCandidate" :size="128"
                        class="mr-7"></k-avater>
            {{ $t('subordinates.removeFromSubordinatesQuestion') }}
          </v-card-title>
          <v-card-text>
            {{ $t('definitions.subordinate') }}
          </v-card-text>
          <v-card-actions>
            <v-btn ref="removeFromSubordinatesConfirm"
                   text color="primary" @click="removeFromSubordinates_click" class="flex-grow-1"
                   v-promise-btn
            >
              {{ $t('dialog.yes') }}
            </v-btn>
            <v-btn text color="secondary" @click="removeFromSubordinatesDialog=false" class="flex-grow-1"
                   v-promise-btn
            >
              {{ $t('dialog.no') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>

    <!--    заявки в десятку-->
    <template v-if="value.foremanRequests && value.foremanRequests.length">

      <transition-group
        name="list-complete" tag="div" class="mx-auto"
        style="width: 100%; max-width:350px; position: relative;">
        <v-card v-for="eachRequest in value.foremanRequests" :key="eachRequest.id"
                elevation="12" class="mb-10 list-complete-item" style="width: 100%;">
          <v-card-title>Заявка на вступление в десятку</v-card-title>
          <v-divider></v-divider>
          <kopnik-view ref="foremanRequest"
                       :value="eachRequest"
                       location birthyear role
                       readonly
          >
          </kopnik-view>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn ref="confirmForemanRequest"
                   color="success" class="flex"
                   @click="confirmForemanRequest_click(eachRequest)"
                   v-promise-btn
            >
              {{ $t('subordinates.confirmForemanRequest') }}
            </v-btn>
            <v-btn ref="declineForemanRequest"
                   color="error" class="flex"
                   @click="declineForemanRequest_click(eachRequest)"
                   v-promise-btn
            >
              {{ $t('subordinates.declineForemanRequest') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </transition-group>
    </template>
    <div v-else class="overline font-weight-bold my-auto text-center"
         style="font-size: 1.625rem !important; color: #BDBD; width: 100%;  max-width: 350px">
      Заявок нет
    </div>

  </v-container>
</template>
<script>
import Kopnik from "../models/Kopnik"
import thanks from "../thanks";

import KopnikView from './KopnikVue'
import KAvater from "./KAvatar";
import logger from "./mixin/logger";
import {container} from "../bottle/bottle";

export default {
  name: "Subordinates",
  mixins: [logger],
  components: {
    KopnikView,
    KAvater,
  },
  data: () => {
    return {
      resetForemanDialog: false,
      removeFromSubordinatesDialog: false,
      removeFromSubordinatesCandidate: false,
      application: container.application,
    }
  },
  props: {
    value: {
      type: Kopnik,
      required: true
    }
  },
  computed: {
    extendedSubordinates() {
      const result = [...(this.value.subordinates || [])]
      result.length = 9
      return result
    }
  },
  methods: {
    // принять подчиненного в десятку
    async confirmForemanRequest_click(request) {
      await container.application.user.confirmForemanRequest(request)
      container.application.infos.push(container.application.getMessage('subordinates.confirmForemanRequestInfo'))
    },
    // отказать войти в десятку
    async declineForemanRequest_click(request) {
      await container.application.user.declineForemanRequest(request)
      container.application.infos.push(container.application.getMessage('subordinates.declineForemanRequestInfo'))
    },
    // спросить удалить подчиненного из десятки
    async removeFromSubordinatesAsk_click(subordinate) {
      this.removeFromSubordinatesCandidate = subordinate
      this.removeFromSubordinatesDialog = true
    },
    // удалить подчиненного из десятки
    async removeFromSubordinates_click() {
      try {
        await container.application.user.removeFromSubordinates(this.removeFromSubordinatesCandidate)
        container.application.infos.push(container.application.getMessage('subordinates.removeFromSubordinatesInfo'))
      } finally {
        this.removeFromSubordinatesDialog = false
      }
    },
    // спросить удалить старшину
    async resetForemanAsk_click() {
      this.resetForemanDialog = true
    },
    // удалить старшину
    async resetForeman_click() {
      try {
        await container.application.user.resetForeman()
        container.application.infos.push(container.application.getMessage('details.resetForemanInfo'))
      } finally {
        this.resetForemanDialog = false
      }
    },
  },
  async created() {
    await this.value.reload()
    await this.value.reloadSubordinates()
    await this.value.reloadForemanRequests()
  },
}
</script>

<style>
.k-badge-event-handler .v-badge__wrapper {
  pointer-events: all;
}

.list-complete-leave-active {
  position: absolute;
}

.list-complete-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.list-complete-item {
  transition: all .25s;
  display: inline-block;
  margin-right: 10px;
}
</style>
