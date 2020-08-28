<template>
  <v-container fluid class="fill-height k-subordinates flex-column align-center">
    <v-card elevation="12"
            class="pt-4 mb-10 d-flex flex-column align-content-stretch align-center"
            width="100%" max-width="350px"
    >
      <!--      старшина-->
      <v-badge v-if="value.foreman"
               ref="value.foreman"
               :title="value.foreman.name"
               class='k-badge-event-handler' color="red" :offset-x="(64/64)*7+14" :offset-y="(64/64)*7+14"
      >
        <!--крестик-->
        <div slot="badge" ref="remove"
             :title="$t('details.resetForeman')" style="cursor: pointer"
             @click="resetForeman_click"
        >
          x
        </div>
        <!--аватарка-->
        <AvatarVue :value="value.foreman"
                   :size="64" class="mb-2">
        </AvatarVue>
      </v-badge>
      <!--      стрелка к старшине-->
      <v-icon v-if="value.foreman" :color="value.foreman?'red':'#CCC'" size="250"
              style="margin-top: -40px; margin-bottom: -80px">
        mdi-arrow-up-bold
      </v-icon>
      <!--      пользователь -->
      <AvatarVue :value="value"
                 :size="64" class="mb-2">
      </AvatarVue>
      <!--      стрелка к пользователю-->
      <v-icon :color="(value.subordinates && value.subordinates.length)?'blue':'#CCC'"
              :size="(((value.rank===1?2:value.rank)-1)/value.rank)*250"
              style="margin-top: -40px; margin-bottom: -80px">
        mdi-arrow-up-bold
      </v-icon>
      <!--      десятка пользователя -->
      <div class="d-flex flex-wrap mt-2 justify-space-around">
        <template v-for="(eachSubordinate, eachSubordinateIndex) of extendedSubordinates">
          <v-badge v-if="eachSubordinate"
                   ref="subordinates"
                   :key="eachSubordinate.id"
                   :title="eachSubordinate.name"
                   class='k-badge-event-handler' color="red" :offset-x="(64/64)*7+14" :offset-y="(64/64)*7+14"
          >
            <!--крестик-->
            <div slot="badge" ref="remove"
                 :title="$t('subordinates.removeFromSubordinates')" style="cursor: pointer"
                 @click="removeFromSubordinates_click(eachSubordinate)"
            >
              x
            </div>
            <!--аватарка-->
            <AvatarVue :value="eachSubordinate"
                       :size="64" class="mb-2">
            </AvatarVue>
          </v-badge>
          <v-avatar v-else :key="-eachSubordinateIndex"
                    :size="64" class="mb-2">
            <v-icon :size="64">mdi-account</v-icon>
          </v-avatar>
        </template>
      </div>
    </v-card>
<!--    <div class="text-h5" style="max-width: 350px">
      Заявки на вступление в десятку
    </div>-->
    <template v-if="value.foremanRequests && value.foremanRequests.length">

      <transition-group
        name="list-complete" tag="div" class="mx-auto"
        style="width: 100%; max-width:350px; position: relative;">
        <v-card ref="foremanRequests" v-for="eachRequest in value.foremanRequests" :key="eachRequest.id"
                elevation="12" class="mb-10 list-complete-item" style="width: 100%;">
          <kopnik-view :value="eachRequest" location birthyear role readonly></kopnik-view>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="success" class="flex"
                   @click="confirmForemanRequest_click(eachRequest)"
                   v-promise-btn
            >
              {{ $t('subordinates.confirmForemanRequest') }}
            </v-btn>
            <v-btn color="error" class="flex"
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
import AvatarVue from "./AvatarVue";
import logger from "./mixin/logger";
import {container} from "../bottle/bottle";

export default {
  name: "Subordinates",
  mixins: [logger],
  components: {
    KopnikView,
    AvatarVue,
  },
  data: () => {
    return {
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
    // удалить подчиненного из десятки
    async removeFromSubordinates_click(user) {
      await container.application.user.removeFromSubordinates(user)
      container.application.infos.push(container.application.getMessage('subordinates.removeFromSubordinatesInfo'))
    },
    // удалить старшину
    async resetForeman_click() {
      await container.application.user.resetForeman()
      container.application.infos.push(container.application.getMessage('details.resetForemanInfo'))
    },

  },
  async created() {
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
