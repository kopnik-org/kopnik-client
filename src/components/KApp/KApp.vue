<template>
  <v-app id="inspire" :class="{'k-touch-device':isTouchDevice}">
    <k-alert/>
    <v-app-bar app>
      <v-badge
        :value="application.user && (application.user.status===application.user.constructor.Status.NEW || !!application.user.foremanRequests && application.user.foremanRequests.length || !!application.user.witnessRequests && application.user.witnessRequests.length)"
        color="red"
        dot
        offset-x="15"
        offset-y="15"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      </v-badge>
      <v-toolbar-title> {{ sectionName }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <!--      языки-->
      <v-menu
        offset-y open-on-hover
        bottom
        left
        close-delay="200"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar tile size="32">
              <v-img :src="getFlagImage(application.localeManager.currentLocale)"></v-img>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <!--          v-model="application.localeManager.currentLocale"-->
          <v-list-item-group v-model="application.localeManager.currentLocale">
            <v-list-item v-for="eachLocale in application.localeManager.locales"
                         :value="eachLocale"
                         :key="eachLocale.locale"
            >
              <v-list-item-avatar tile>
                <v-img :src="getFlagImage(eachLocale)"/>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ eachLocale.languageName }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>

        </v-list>
      </v-menu>
    </v-app-bar>
    <k-drawer v-if="application.user" v-model="drawer" style="z-index: 700;"></k-drawer>
    <v-main>
      <component v-if="application.section" ref="section" class="k-content" v-bind:is="'k-'+application.section"
                 :value="application.user"></component>
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
      mode: 'regular',
      // mode:'presentation',
      application: container.application,
      center: [47.413220, -1.219482],
      zoom: 14,
      drawer: false,
    }
  },
  watch: {
    'application.localeManager._currentLocale': async function (current, old) {
      if (current) {
        await this.followLocale()
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
      return this.application.section ? this.$t(`drawer.${_.camelCase(this.application.section)}`) : null
    },
  },
  methods: {
    getFlagImage(locale) {
      switch (locale.name) {
        case 'ru':
          return 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/shop/products/flag_rf_enl.jpg?itok=ULSeepRk'
        case 'sk':
          return 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/directory_names/flag_slovakija_enl.jpg?itok=_XTuiL2L'
        case 'pl':
          return 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/directory_names/flag_polsha_enl.jpg?itok=FqbWDb5P'
        case 'cs':
          return 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/directory_names/flag_chehija_enl.jpg?itok=sGu3fL8K'
        case 'de':
          return 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/directory_names/flag_germanija_enl.jpg?itok=ajc0p1k8'
        case 'en':
          return 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/shop/products/flag_velikobritanija_new.jpg?itok=WpoIClkv'
      }
    },
    async followLocale() {
      const locale = this.application.localeManager.currentLocale
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
    this.followLocale()
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
