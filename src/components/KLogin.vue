<template>
  <v-container fluid class="fill-height k-login flex-column align-center">

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
          Первая сеть Копного Права
        </v-card-title>
        <v-card-text class="text-center">
          Славянские общины в каждом городе благодаря Копному Праву и интернет-технологиям
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
        <v-img :src=eachFeature.image></v-img>
      </v-card-actions>
      <v-card-actions v-if="eachFeature.action">
        <v-btn
          text
          color="primary"
          class="mx-auto"
          @click="onActionClick(eachFeature.action.url)">
          {{ eachFeature.action.title }}
          <v-icon>
            mdi-chevron-right
          </v-icon>
        </v-btn>
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
      features: [
        {
          icon: 'img/logo_circle.png',
          title: 'Находи соседей, готовых объединяться по копному',
          text: 'Каждый участник сети – реальный человек, который подтвердил свое место проживания, имя и роль (положение) в копном обществе.',
          image: 'https://doc-04-8k-docs.googleusercontent.com/docs/securesc/ed9iqqtek9fgkk3upo1rb0bonm0u80ac/vcnm5nkjophldbej7rs4m2ub440ljvgc/1629642225000/11144089072991499103/11144089072991499103/1SMv-ZQ8CU6GLJlYPPPKKYiT3LWyLbmq8?e=download&authuser=0',
        },
        {
          icon: 'img/logo_circle.png',
          title: 'Находи славянские общины в своем городе, в которые можно вступить прямо сейчас',
          text: 'Копные общины состоят из десяток с избираем по копному старшиной.  Все десятки соединены на карте связями от общинника к старшине. Чем больше маркер старшины на карте, тем больше возглавляемая им община.',
          image: 'https://sun9-17.userapi.com/impg/knNbld9F_7u_dSML8czkMNSui10IHgp5022vtw/uzuRId2Vrz8.jpg?size=640x360&quality=96&sign=74ab8d569c2b15e7c388431b54cb70bc&type=album'
        },
        {
          icon: 'img/logo_circle.png',
          title: 'Живи по-копному',
          text: 'Копный муж, Стремящийся в копные мужья, Старец, а также Женщина. Выбери свою роль согласно полу, возрасту и прожитому опыту. Разделение полномочий по ролям в Копном обществе гарантирует наиболее эффективное взаимодействие и управление общиной.',
          image: 'img/about/roles.png',
          action: {
            title: 'Подробнее',
            url: 'https://www.youtube.com/watch?v=4EI33xMk0XA&list=PL8t968Ip0ARl1hHWBmjmOmV8AHR_0pz4H',
          }
        },
        {
          icon: 'img/logo_circle.png',
          title: 'Собирай копы как раз-два-три',
          text: 'Собрать копу стало просто как никогда благодаря интернет-технологиям. Копы собираются и проводится строго по копному вживую или онлайн. Копный порядок очень эффективен и гарантирует достижение единогласных решений. А единогласное решение - залог совместного движения вперед.',
          image: 'img/about/invite-kopa.png',
          action: {
            title: 'Подробнее',
            url: 'https://www.youtube.com/watch?v=gITir5b6LKA&list=PL8t968Ip0ARkKVp0rVqkK3DJ5VDi9nrZe&index=9&t=1s',
          }
        },
        {
          icon: 'img/logo_circle.png',
          title: 'Используй силу общины',
          text: 'Используй силу копной общины, чтобы навести порядок во всем: в подъезде, во дворе, в городе, в стране и в мире. Живи богато и счастливо вместе с общиной. Ни один самый выдающийся человек не в состоянии преодолеть сложные препятствия. Только складывая наши усилия в общине и направляя их в одну сторону, можно добиться результата.',
          image: 'https://sun9-65.userapi.com/impg/EE430Hf1owr-9hPmjSr0WiUAw10miyveHtTfcA/-wAKyGOCpTY.jpg?size=2560x1007&quality=96&sign=aa3559405645a714881c5a9ed5b7c192&type=album',
          action:{
            title:'Подробнее',
            url:'https://www.youtube.com/playlist?list=PL8t968Ip0ARl6vGqlB_jGi-srH6wx3t3H',
          }
        },
        {
          icon: 'img/logo_circle.png',
          title: 'Строй международные общины',
          text: 'Не останавливайся на границах своего города или страны. Копник работает по всему миру и переведен на все славянские языки. Благодаря современным интернет-технологиям и тому, что Копное Право наша универсальная технология построения общин, нет ничего проще, чем собрать страновые копные славянские общины в одну глобальную копную славянскую общину.',
          image: 'img/about/global-obshina.png',
          action:{
            title: 'Подробнее',
            url: 'https://www.youtube.com/watch?v=_DovDGitYxg&t=11s',
          }
        },
      ],
      // https://www.megaflag.ru/information/spravochnaya-informaciya/flagi-stran
    }
  },
  props: {}
  ,
  computed: {}
  ,
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
    }    ,
    login_click() {
      location.href = container.constants.messenger.loginUrl
    }    ,
    onActionClick(url){
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
  }
  ,
  async mounted() {
    /*    container.VK.Widgets.Auth("vk_auth", {"onAuth":function(data) {
          alert('user '+data['uid']+' authorized')
        }});*/
  }
}
</script>

<style lang="scss">
.k-login {
  .v-card {
    border: none !important;
  }
}
</style>
