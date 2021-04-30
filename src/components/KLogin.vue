<template>
  <v-row login class="fill-height pa-0 flex-column flex-nowrap align-center"
         style="position: fixed; top:0; left:0; right: 0; z-index: 100">
    <v-col id="top">

    </v-col>
    <v-avatar size="170">
      <v-img src="img/logo_circle.png"></v-img>
    </v-avatar>
    <div class="pa-1 tagline text-center">
      <span>{{ $t('login.KopaLaw') }}</span>
      <div style="font-size: smaller">{{ $t('login.insideEachPhone') }}</div>
    </div>
    <v-col id="bottom" class="d-flex flex-column align-center" style="width: inherit; justify-content: space-between">
      <div v-if="application.user===null"
           id="flags">
        <img v-for="eachLocale in locales"
             :key="eachLocale.locale"
             :src="eachLocale.img"
             :title="eachLocale.title"
             @click="onFlagClick(eachLocale.locale)"
        />
      </div>
<!--      <div style="flex-grow: 1000"></div>-->
      <v-btn v-if="application.user===null" color="primary" @click="login2_click">
        {{ $t('login.login') }}
      </v-btn>
      <div class="mt-0 mb-8 " style="color: #555; font-size: .95em">
        <a target="_blank" :href="`https://github.com/kopnik-org/kopnik-wiki/blob/main/${application.localeManager.currentLocale.name}/readme.md`"> {{ $t('login.aboutUs') }} </a> |
        <a target="_blank" :href="`https://github.com/kopnik-org/kopnik-wiki/blob/main/${application.localeManager.currentLocale.name}/contacts.md`"> {{ $t('login.contacts') }} </a>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import _ from 'lodash'
import {container} from "../bottle/bottle";
import i18n from "../plugins/i18n";
import logger from "./mixin/logger";

export default {
  name: "Login",
  mixins: [logger],
  components: {},

  data() {
    return {
      application: container.application,
      quoteIndex: 0,
      // https://www.megaflag.ru/information/spravochnaya-informaciya/flagi-stran
      locales: [
        {
          locale: 'ru',
          title: 'Русский',
          img: 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/shop/products/flag_rf_enl.jpg?itok=ULSeepRk'
        },
        {
          locale: 'sk',
          title: 'Slovenský',
          img: 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/directory_names/flag_slovakija_enl.jpg?itok=_XTuiL2L'
        },
/*        {
          locale: 'pl',
          title: 'Polski',
          img: 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/directory_names/flag_polsha_enl.jpg?itok=FqbWDb5P'
        },*/
        {
          locale: 'cs',
          title: 'Český',
          img: 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/directory_names/flag_chehija_enl.jpg?itok=sGu3fL8K'
        },
/*        {
          locale: 'de',
          title: 'German',
          img: 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/directory_names/flag_germanija_enl.jpg?itok=ajc0p1k8'
        },*/
        {
          locale: 'en',
          title: 'English',
          img: 'https://www.megaflag.ru/sites/default/files/styles/h_100/public/images/shop/products/flag_velikobritanija_new.jpg?itok=WpoIClkv'
        },
      ]
    }
  },
  props: {},
  computed: {},
  watch: {
    'application.user': function (cur) {
      if (cur === null) {
      }
    }
  },
  methods: {
    onFlagClick(localeString) {
      container.application.localeManager.currentLocale = localeString
    },
    login_click() {
      location.href = container.constants.messenger.loginUrl
    },
    login2_click() {
      location.href = container.constants.auth.url
    },
  },
  async created() {
    // this.request = await this.$root.$options.app.user.loaded()
    setInterval(() => {
      this.quoteIndex = _.random(i18n.messages.ru.length)
    }, 30000)
  },
  async mounted() {
    /*    container.VK.Widgets.Auth("vk_auth", {"onAuth":function(data) {
          alert('user '+data['uid']+' authorized')
        }});*/
  }
}
</script>
<style>
.tagline {
  border-radius: 4px;
  line-height: 1;
  background-color: white;
}

#flags img {
  width: 50px;
  margin: 0 1px;
}
</style>
