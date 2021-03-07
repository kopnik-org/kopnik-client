<template>
  <v-container fluid class="fill-height k-witness flex-column align-center">
    <v-card v-for="(eachRequest, index) in application.user.witnessRequests" :key="eachRequest.id"
            elevation="12" class="mb-10" width="100%" max-width="350px">
      <kopnik-view ref="witnessRequest"
                   :value="eachRequest" locale fio birth-year passport role location readonly></kopnik-view>
      <v-card-actions>
        <!--  Заверить-->
        <v-dialog ref="confirmDialog"
                  v-model="confirmDialog"
                  :max-width="450"
        >
          <!-- кнопка-активатор-->
          <template v-slot:activator="{ on, attrs }">
            <v-btn ref="confirmAsk"
                   v-if="eachRequest.witnessChatInviteLink"
                   color="success" class="flex-grow-1"
                   v-bind="attrs"
                   v-on="on"
            >
              {{ $t('witness.confirm') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              {{ $t('witness.confirm') }} ?
            </v-card-title>
            <v-card-actions>
              <v-btn ref="confirmYes" text color="primary"
                     @click="updateRequestStatus_click(eachRequest, Status.CONFIRMED)" class="flex-grow-1"
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

        <!-- Открыть чат-->
        <v-btn ref="openWitnessChat"
               v-if="eachRequest.witnessChatInviteLink"
               color="warning" class="flex-grow-1"
               @click="onOpenWitnessChatClick(eachRequest)"
        >
          {{ $t('witness.openWitnessChat') }}
        </v-btn>
          <!--  Отклонить-->
          <v-dialog ref="declineDialog"
                    v-model="confirmDialog"
                    :max-width="450"
          >
            <!-- кнопка-активатор-->
            <template v-slot:activator="{ on, attrs }">
              <v-btn ref="declineAsk"
                     v-if="eachRequest.witnessChatInviteLink"
                     color="success" class="flex-grow-1"
                     v-bind="attrs"
                     v-on="on"
              >
                {{ $t('witness.decline') }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                {{ $t('witness.confirm') }} ?
              </v-card-title>
              <v-card-actions>
                <v-btn ref="declineYes" text color="primary"
                       @click="updateRequestStatus_click(eachRequest, Status.DECLINED)" class="flex-grow-1"
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
      </v-card-actions>
    </v-card>
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
      confirmDialog: false,
      declineDialog: false,
    }
  },
  props: {},
  computed: {},
  watch: {},
  methods: {
    /**
     *
     * @param {Kopnik} request
     * @param {Number} status
     * @returns {Promise<void>}
     */
    async updateRequestStatus_click(request, status) {
      request.status = status
      await this.application.user.resolveWitnessRequest(request)
    },
    onOpenWitnessChatClick(halfUser){
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
