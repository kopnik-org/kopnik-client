<template>
  <v-app id="inspire" :class="{'k-touch-device':isTouchDevice}">
    <k-alert/>
    <v-app-bar v-if="application.user && mode!='presentation'" app>
      <v-badge
        :value="application.user.status===application.user.constructor.Status.NEW || !!application.user.foremanRequests && application.user.foremanRequests.length || !!application.user.witnessRequests && application.user.witnessRequests.length"
        color="red"
        dot
        offset-x="15"
        offset-y="15"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      </v-badge>
      <v-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title> {{ sectionName }}</v-toolbar-title>
<!--      <v-spacer/>-->
<!--      <v-img src="img/logo_circle.png" max-width="40" contain></v-img>-->
    </v-app-bar>
    <k-drawer v-if="application.user" v-model="drawer" style="z-index: 700;"></k-drawer>
    <v-main>
      <k-login v-if="!application.user && application.section!=='Thanks'"></k-login>
      <!--            <keep-alive :exclude="[Main]">-->
      <!--                <transition :name="contentTransitionName">-->
      <component ref="section" class="k-content" v-bind:is="'k-'+application.section"
                 :value="application.user"></component>
      <!--                </transition>-->
      <!--            </keep-alive>-->
    </v-main>
  </v-app>
</template>

<script>
import _ from 'lodash'
import KLogin from '../KLogin'
import KMain from '../KMain'
import KThanks from '../KThanks'
import KProfile from "../KProfile";
import KWitness from "../KWitness";
import {container} from "../../bottle/bottle";
import KDrawer from "../KDrawer";
import logger from '../mixin/logger'
import Application from "../../application/Application";
import {Kopnik} from '../../models'
import flushPromises from "flush-promises";
import KTen from '../KTen'
import touchDetector from "../mixin/touch-detecter";
import KAlert from "../KAlert/KAlert";
import {localize} from "vee-validate";

export default {
  mixins: [touchDetector, logger],
  components: {
    KDrawer,
    KLogin,
    KProfile,
    KMain,
    KThanks,
    KWitness,
    KTen,
    KAlert,
  },
  props: {
    source: String,
  },
  data() {
    return {
      mode:'regular',
      // mode:'presentation',
      application:  container.application,
      center: [47.413220, -1.219482],
      zoom: 14,
      drawer: false,
    }
  },
  watch: {
    'application.user.locale': async function (current, old) {
      if (current) {
        this.followUserLocale()
      }
    },
    /**
     * меняем роут вслед за изменением раздела в моделе
     */
    'application.section': async function (current, prev) {
      // ожидаем выполнения промисов внктри application.setSection()
      await flushPromises()
      if (this.application.section !== this.$route.name) {
        await this.$router.push({name: this.application.section})
      }
    },
  },
  computed: {

    sectionName() {
      return this.$t(`drawer.${_.camelCase(this.application.section)}`)
    },
  },
  methods: {
    async followUserLocale() {
      const locale = this.application.user.locale
      // задаем текущую локаль приложению
      container.localeManager.currentLocale = locale
      // vue-i18n меняем сообщения в разметке страниц
      this.$options.i18n.locale = locale.name
      // vuetify меняем сообщения в разметке vuetify
      this.$vuetify.lang.current = locale.name
      // vee-valiedate меняем сообщения об ошибках валидации
      localize(locale.name)

    },
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      // this.map=
      // this.$refs.map.mapObject.setView([51.505, -0.09], 13)

    })
    /*            window.addEventListener('beforeunload', (event) => {
                    // Cancel the event as stated by the standard.
                    event.preventDefault();
                    // Chrome requires returnValue to be set.
                    event.returnValue = '';
                });*/
  }
}
</script>

<style lang="scss">
.content2other-leave {
  position: absolute;
}

.content2other-leave-to {
}

.content2other-leave-active {
  transition: all 0.1s ease-out;
  position: absolute;
}

.content2other-enter {
  transform: translateY(100vh);
}

.content2other-enter-to {
  transform: translateY(0);
}

.content2other-enter-active {
  transition: all 0.1s ease-in;
}

.content2main-leave {
  position: absolute;
}

.content2main-leave-to {
  transform: translateY(100vh);
}

.content2main-leave-active {
  transition: all 0.1s ease-out;
  position: absolute;
  z-index: 1;
}

.content2main-enter {
  /*transform: translateY(100vh);*/
}

.content2main-enter-to {
  /*transform: translateY(0);*/
}

.content2main-enter-active {
  transition: all 0.1s ease-in;
}
</style>
