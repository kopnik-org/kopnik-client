<template>
  <v-navigation-drawer v-if="$router && application.user"
                       :value="value"
                       temporary touchless
                       @input="drawer_input"
                       app>
    <router-link to="/profile" class="cursor-pointer" tag="div">
      <kopnik-vue v-if="application.user" :value="application.user" to="/profile"
                  :avatar-size="64" class="flex-grow-1">
      </kopnik-vue>
    </router-link>
    <v-divider></v-divider>
    <v-list>
      <v-list-item link to="/profile">
        <v-list-item-action>
          <v-badge :value="isProfileDirty"
                   color="red"
                   dot
          >
            <v-icon>mdi-account</v-icon>
          </v-badge>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.profile') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link to="/">
        <v-list-item-action>
          <v-icon>mdi-home-city</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.main') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item subordinates :disabled="!application.user" @click="ten_click">
        <v-list-item-action>
          <v-badge :value="isTenDirty"
                   color="red"
                   :content="application.user.foremanRequests?application.user.foremanRequests.length:null"
          >
            <v-icon>mdi-account-multiple</v-icon>
          </v-badge>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.ten') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="application.user && application.user.tenChatInviteLink && application.user.subordinates && application.user.subordinates.length" link target="_blank"
                   :href="application.user.tenChatInviteLink">
        <v-list-item-action>
          <v-icon>mdi-chat</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.tenChat') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link v-if="application.user && application.user.foreman && application.user.foreman.tenChatInviteLink" target="_blank"
                   :href="application.user.foreman.tenChatInviteLink">
        <v-list-item-action>
          <v-icon>mdi-chat</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.foremanChat') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="application.user && application.user.isWitness  || application.user && application.user.status!=application.user.constructor.Status.CONFIRMED"
        @click="witness_click"
      >
        <v-list-item-action>
          <v-badge :value="isWitnessDirty"
                   color="red"
                   :content="application.user.witnessRequests?application.user.witnessRequests.length:null"
          >
            <v-icon>mdi-human-greeting</v-icon>
          </v-badge>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.witness') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link to="/thanks">
        <v-list-item-action>
          <v-icon>mdi-heart</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.thanks') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click="onHelpClick">
        <v-list-item-action>
          <v-icon>mdi-help-circle</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.help') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link to="/about">
        <v-list-item-action>
          <v-icon>mdi-information</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.about') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-divider/>
      <v-list-item>
        <v-list-item-action>
          <v-icon>mdi-alpha-r</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ application.version.version }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item logout link @click="logout_click">
        <v-list-item-action>
          <v-icon>mdi-location-exit</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('drawer.logout') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script>

import KopnikVue from "./KopnikVue";
import {container} from "../bottle/bottle";
import logger from "./mixin/logger";
import Kopnik from "../models/Kopnik";
import Application from "@/application/Application";


/**
 * @property {Application} application
 */
export default {
  mixins: [logger],
  components: {
    KopnikVue,
  },
  data() {
    return {
      PACKAGE_VERSION: process.env.PACKAGE_VERSION,
      application: container.application,
      KopnikStatus: Kopnik.Status,
    }
  },
  props: {
    value: {
      type: Boolean
    }
  },
  computed: {
    isProfileDirty() {
      return this.application.user.status === Kopnik.Status.NEW
    },
    isTenDirty() {
      return !!this.application.user.foremanRequests && this.application.user.foremanRequests.length
    },
    isWitnessDirty() {
      return !!this.application.user.witnessRequests && this.application.user.witnessRequests.length
    },
  },
  methods: {
    onHelpClick(){
      window.open(`https://github.com/kopnik-org/kopnik-wiki/tree/main/${this.application.user.locale.name}`)
    },
    async witness_click() {
      if (await this.application.forwardUserToBeConfirmed()) {
        return
      }
      await this.application.lockSection(async () => {
        await this.application.setSection(Application.Section.Witness)
      })
    },
    async ten_click() {
      if (await this.application.forwardUserToBeConfirmed()) {
        return
      }
      await this.application.lockSection(async () => {
        await this.application.setSection(Application.Section.Ten)
      })
    },
    throwUnderConstructionError() {
      throw new Error(this.$t(this.application.getMessage('errors.underConstruction')))
    },
    drawer_input(event) {
      // console.log('event', event)
      this.$emit('input', event)
    },
    async logout_click() {
      await this.application.logout()
    },
  },
  async created() {
    await this.application.resolveUser()
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
