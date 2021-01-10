<template>
  <v-container v-if="application.user"
               fluid class="fill-height">
    <ValidationObserver ref="obs" v-slot="{ invalid, validated, passes, validate }"
                        tag="div" class="mx-auto" style="width: 100%; max-width:350px">
      <v-card elevation="12">
        <v-card-text>
          <v-form>
            <v-alert :color="application.user.status==2?'info':'warning'" v-html="alert">
            </v-alert>
            <kopnik-vue ref="request"
                        :value="application.user"
                        locale fio birthYear passport role location
                        @locale_change="locale_change"
            ></kopnik-vue>
            <v-list v-if="wasMessagesFromGroupAllowed===false">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title style="white-space: inherit !important;">{{
                      $t('profile.messagesFromGroup.allow')
                    }}
                  </v-list-item-title>
                  <!--doc: https://vk.com/dev/Subscribe?link=https%3A%2F%2Fvk.com%2Fsvetoslav_igorevich&mode=0&oid=573258821-->
                  <div id="vk_allow_messages_from_community" class="text-center my-3"></div>
                </v-list-item-content>
              </v-list-item>
              <slot></slot>
            </v-list>
            <v-btn ref="confirm"
                   :color="application.user.firstName"
                   block
                   :disabled="invalid || !isMessagesFromGroupAllowed"
                   @click="submit_click"
                   v-promise-btn
            >
              {{ $t('profile.submit') }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </ValidationObserver>
  </v-container>
</template>
<script>
import {
  ValidationObserver,
} from "vee-validate"

import {Kopnik} from "../models"
import {bottle, container} from "../bottle/bottle";
import logger from "./mixin/logger";
import KopnikVue from "./KopnikVue";
import api from "../api";

export default {
  mixins: [logger],
  name: "Profile",
  components: {
    ValidationObserver,
    KopnikVue,
  },

  data() {
    return {
      application: container.application,
      // в текущий момент
      isMessagesFromGroupAllowed: undefined,
      // при инициализации страницы
      wasMessagesFromGroupAllowed: undefined,
    }
  },
  props: {},
  computed: {
    alert(){
      return this.$t(`profile.alert[${this.application.user.status}]`, {witnessChatInviteLink: this.application.user.witnessChatInviteLink})
    }
  },
  watch: {},
  methods: {
    async submit_click() {
      this.application.user.birthYear = parseInt(this.application.user.birthYear)
      await this.application.user.updateProfile()
      this.application.infos.push(this.$t('profile.submitMessage'))
      await this.application.setSection(container.application.constructor.Section.Main)
    },
    /**
     * Здесь локаль сохраняется потому что этот компонент отображает только текущего пользователя,
     * который может вызвать api/users/setLocale()
     *
     * @param {Locale} event
     * @returns {Promise<void>}
     */
    async locale_change(event) {
      // задаем локаль текущему пользователю
      await this.application.user.setLocale(event)
    }
  },
  async created() {
    await this.application.resolveUser()
  },
  async mounted() {
    this.wasMessagesFromGroupAllowed = this.isMessagesFromGroupAllowed = await this.application.user.isMessagesFromGroupAllowed()
    // doc: https://vk.com/dev/widget_subscribe
    if (!this.isMessagesFromGroupAllowed) {
      container.VK.Widgets.Subscribe("vk_allow_messages_from_community", {mode: 1, soft:  1,}, container.constants.messenger.svetoslav_id);
      container.VK.Observer.subscribe("widgets.subscribed", (userId) => {
        this.isMessagesFromGroupAllowed = true
      })
      container.VK.Observer.subscribe("widgets.unsubscribed", (userId) => {
        this.isMessagesFromGroupAllowed = false
      })
    }
  },
  async beforeDestroy() {
    container.VK.Observer.unsubscribe("widgets.allowMessagesFromCommunity.allowed")
    container.VK.Observer.unsubscribe("widgets.allowMessagesFromCommunity.denied")

    if (this.application.user){
      await this.application.user.reload()
    }
  },
}
</script>
