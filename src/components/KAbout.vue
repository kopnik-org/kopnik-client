<template>
  <v-container fluid class="fill-height k-about flex-column align-center">

    <!--    блок высотой 75% экрана для размещения внутри него первой карты-->
    <div
      class="d-flex justify-center align-center"
      style="height: calc(100vh - 180px); border: solid 0px black">

      <!--      первая карта-->
      <v-card
        outlined
        style="width: 100%; max-width: 700px;"
      >
        <v-img src="img/logo_circle.png"
               max-width="68px"
               class="mx-auto">
        </v-img>
        <v-card-title
          class="text-h4 justify-center text-center word"
          style="word-break: normal"
        >
          kopnik.org<br>
          {{ $t('about.articles[0].title') }}
        </v-card-title>
        <v-card-text class="text-center">
          {{ $t('about.articles[0].description') }}
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="application.user===null"
                 class="mx-auto"
                 color="primary"
                 large
                 @click="login2_click">
            {{ $t('login.login') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <!--    кнопка стрелка вниз для перехода ко второй странице-->
    <v-btn
      fab
      small
      :elevation="4"
      style="margin-bottom: 96px;"
      @click="onArrowDownClick">
      <v-icon dark>
        mdi-chevron-down
      </v-icon>
    </v-btn>

    <!--фичи-->
    <v-card v-for="(eachFeature,i) of features" :key="i"
            outlined
            style="width: 100%; max-width: 700px; margin-bottom: 128px;"
    >
      <v-img :src="eachFeature.icon"
             max-width="68px"
             class="mx-auto">
      </v-img>
      <v-card-title
        class="text-h5 justify-center text-center word"
        style="word-break: normal">
        {{ eachFeature.title }}
      </v-card-title>
      <v-card-text class="text-center">
        {{ eachFeature.text }}
      </v-card-text>
      <v-card-actions v-if="eachFeature.image">
        <v-img :src=eachFeature.image :max-height="400"></v-img>
      </v-card-actions>
    </v-card>


    <!--нижняя кнопка войти-->
    <v-btn v-if="application.user===null"
           class="mx-auto"
           color="primary"
           large
           @click="login2_click">
      {{ $t('login.login') }}
    </v-btn>

    <!--контакты-->
    <div class="pa-1 ma-3 tagline " style="color: #555; font-size: .9em">
      <a target="_blank"
         :href="`https://github.com/kopnik-org/kopnik-wiki/blob/main/${application.localeManager.currentLocale.name}/readme.md`">
        {{ $t('login.aboutUs') }} </a> |
      <a target="_blank"
         :href="`https://github.com/kopnik-org/kopnik-wiki/blob/main/${application.localeManager.currentLocale.name}/contacts.md`">
        {{ $t('login.contacts') }} </a>
    </div>

  </v-container>
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
    }
  },
  props: {},
  computed: {
    features() {
      return [
        {
          icon: 'img/logo_circle.png',
          title: this.$t('about.articles[1].title'),
          text: this.$t('about.articles[1].description'),
          image: 'img/about/find-1.gif',
        },
        {
          icon: 'img/logo_circle.png',
          title: this.$t('about.articles[2].title'),
          text: this.$t('about.articles[2].description'),
          image: 'img/about/find-obshina.gif'
        },
        {
          icon: 'img/logo_circle.png',
          title: this.$t('about.articles[3].title'),
          text: this.$t('about.articles[3].description'),
          image: this.$t('about.articles[3].image'),
          action: {
            title: 'Подробнее',
            url: 'https://www.youtube.com/watch?v=4EI33xMk0XA&list=PL8t968Ip0ARl1hHWBmjmOmV8AHR_0pz4H',
          }
        },
        {
          icon: 'img/logo_circle.png',
          title: this.$t('about.articles[4].title'),
          text: this.$t('about.articles[4].description'),
          image: this.$t('about.articles[4].image'),
          action: {
            title: 'Подробнее',
            url: 'https://www.youtube.com/watch?v=gITir5b6LKA&list=PL8t968Ip0ARkKVp0rVqkK3DJ5VDi9nrZe&index=9&t=1s',
          }
        },
        {
          icon: 'img/logo_circle.png',
          title: this.$t('about.articles[5].title'),
          text: this.$t('about.articles[5].description'),
          image: 'https://sun9-65.userapi.com/impg/EE430Hf1owr-9hPmjSr0WiUAw10miyveHtTfcA/-wAKyGOCpTY.jpg?size=2560x1007&quality=96&sign=aa3559405645a714881c5a9ed5b7c192&type=album',
          action: {
            title: 'Подробнее',
            url: 'https://www.youtube.com/playlist?list=PL8t968Ip0ARl6vGqlB_jGi-srH6wx3t3H',
          }
        },
        {
          icon: 'img/logo_circle.png',
          title: this.$t('about.articles[6].title'),
          text: this.$t('about.articles[6].description'),
          image: 'img/about/global-obshina.png',
          action: {
            title: 'Подробнее',
            url: 'https://www.youtube.com/watch?v=_DovDGitYxg&t=11s',
          }
        },
      ]
    }
  },
  watch: {
    'application.user':

      function (cur) {
        if (cur === null) {
        }
      }
  }
  ,
  methods: {
    onFlagClick(localeString) {
      container.application.localeManager.currentLocale = localeString
    },
    login_click() {
      location.href = container.constants.messenger.loginUrl
    },
    onActionClick(url) {
      window.open(url)
    },
    login2_click() {
      location.href = container.constants.auth.url
    }
    ,
    onArrowDownClick() {

    }
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

<style lang="scss">
.k-about {
  .v-card {
    border: none !important;
  }
}
</style>
