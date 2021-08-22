<template>
  <div>
    <v-snackbar v-if="hasInfos" v-model="infoVisible" :timeout="-1" multi-line top color="info">
      <div class="flex">
        <div>
          {{ currentInfo }}
        </div>
        <v-btn text xcolor="error" @click="infoVisible = false">
          {{ $t('alert.close') }}
        </v-btn>
      </div>
    </v-snackbar>
    <v-snackbar v-if="hasError" v-model="errorVisible" :timeout="-1" multi-line top color="error">
      {{ currentError.message }}
      <template v-if="currentError.code"> ({{ currentError.code }})</template>
      <v-btn text xcolor="error" @click="errorVisible = false">
        {{ $t('alert.close') }}
      </v-btn>
    </v-snackbar>
    <v-snackbar ref="needUpdate" v-model="application.needUpdate" :timeout="-1" multi-line top color="warning">
      {{ $t('alert.needUpdate') }}
      <v-btn text xcolor="error" @click="onUpdateClick">
        {{ $t('alert.update') }}
      </v-btn>
    </v-snackbar>
    <v-snackbar ref="failedToFetch" v-model="application.failedToFetch" :timeout="-1" multi-line bottom right color="warning">
      {{ $t('alert.failedToFetch') }}
      <v-btn text xcolor="error" @click="onUpdateNetworkStatusClick" v-promise-btn>
        {{ $t('alert.updateNetworkStatus') }}
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Vue from 'vue'
import {container} from "../../bottle/bottle";
import logger from '../mixin/logger'
import {Kopnik} from '../../models'


export default {
  mixins: [logger],
  components: {},
  data() {
    return {
      application: container.application,
      errorVisible: false,
      infoVisible: false,
    }
  },
  computed: {
    hasError() {
      return this.application.errors.length
    },
    hasInfos() {
      return this.application.infos.length
    },
    currentError() {
      const errors = this.application.errors
      if (this.hasError) {
        return (errors[errors.length - 1] instanceof Error) ? errors[errors.length - 1] : new Error(errors[errors.length - 1])
      }
      return null
    },
    currentInfo() {
      const infos = this.application.infos
      if (this.hasInfos) {
        return infos[infos.length - 1]
      }
      return null
    },
  },
  methods: {
    onUpdateClick() {
      location.href = location.href
    },
    async onUpdateNetworkStatusClick() {
      await Kopnik.api('get?ids=')
    }
  },
  watch: {
    async 'application.infos.length'(current, old) {
      this.infoVisible = false
      await Vue.nextTick()
      this.infoVisible = true
    },
    async 'application.errors.length'(current, old) {
      this.errorVisible = false
      await Vue.nextTick()
      this.errorVisible = true
    },
  }
}
</script>

<style lang="scss">
</style>
