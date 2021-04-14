<template>
  <v-container fluid class="fill-height k-witness flex-column align-center">
    <v-card v-for="(eachHalfUser, index) in application.user.witnessRequests" :key="eachHalfUser.id"
            elevation="12" class="mb-10" width="100%" max-width="350px">
      <kopnik-view ref="witnessRequest"
                   :value="eachHalfUser" locale fiorole location readonly></kopnik-view>
      <v-card-actions v-if="eachHalfUser.witnessChatInviteLink">
        <v-btn ref="confirmAsk"
               color="success" class="flex-grow-1"
               @click="onConfirmAskClick(eachHalfUser)"
        >
          {{ $t('witness.confirm') }}
        </v-btn>
        <v-btn ref="openWitnessChat"
               color="warning" class="flex-grow-1"
               @click="onOpenWitnessChatClick(eachHalfUser)"
        >
          {{ $t('witness.openWitnessChat') }}
        </v-btn>
        <v-btn ref="declineAsk"
               color="secondary" class="flex-grow-1"
               @click="onDeclineAskClick(eachHalfUser)"
        >
          {{ $t('witness.decline') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <!--  Диалог Отклонить-->
    <v-dialog ref="declineDialog"
              v-model="declineDialog"
              :max-width="450"
    >
      <v-card>
        <v-card-title>
          {{ $t('witness.decline') }} ?
        </v-card-title>
        <v-card-actions>
          <v-btn ref="declineYes" text color="primary"
                 @click="updateRequestStatus_click(Status.DECLINED)" class="flex-grow-1"
                 v-promise-btn
          >
            {{ $t('dialog.yes') }}
          </v-btn>
          <v-btn ref="declineNo" text color="secondary" @click="declineDialog=false" class="flex-grow-1"
                 v-promise-btn
          >
            {{ $t('dialog.no') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  Диалог Заверить-->
    <v-dialog ref="confirmDialog"
              v-model="confirmDialog"
              :max-width="450"
    >
      <v-card>
        <v-card-title>
          {{ $t('witness.confirm') }} ?
        </v-card-title>
        <v-card-actions>
          <v-btn ref="confirmYes" text color="primary"
                 @click="updateRequestStatus_click(Status.CONFIRMED)" class="flex-grow-1"
                 v-promise-btn
          >
            {{ $t('dialog.yes') }}
          </v-btn>
          <v-btn ref="confirmNo" text color="secondary" @click="confirmDialog=false" class="flex-grow-1"
                 v-promise-btn
          >
            {{ $t('dialog.no') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="application.user.witnessRequests && !application.user.witnessRequests.length"
         class="overline font-weight-bold my-auto" style="font-size: 1.625rem !important; color: #BDBD">Заявок нет
    </div>
  </v-container>
</template>
<script>
import KopnikView from "./KopnikVue"
import {Kopnik} from "../models"
import {container} from "../bottle/bottle";
import logger from "./mixin/logger";

export default {
  name: "Witness",
  mixins: [logger],
  components: {
    KopnikView
  },
  data: () => {
    return {
      application: container.application,
      Status: Kopnik.Status,
      currentHalfUser: null,
      confirmDialog: false,
      declineDialog: false,
    }
  },
  props: {},
  computed: {},
  watch: {},
  methods: {
    onConfirmAskClick(halfUser){
      this.currentHalfUser= halfUser
      this.confirmDialog=true
    },
    onDeclineAskClick(halfUser){
      this.currentHalfUser= halfUser
      this.declineDialog=true
    },

    /**
     *
     * @param {Number} status
     * @returns {Promise<void>}
     */
    async updateRequestStatus_click(status) {
      this.currentHalfUser.status = status
      await this.application.user.resolveWitnessRequest(this.currentHalfUser)
      this.confirmDialog=this.declineDialog= false
    },
    onOpenWitnessChatClick(halfUser) {
      open(halfUser.witnessChatInviteLink,)
    }
  },
  async created() {
    await container.application.user.reloadWitnessRequests()
  },
  async mounted() {
  }
}
</script>
