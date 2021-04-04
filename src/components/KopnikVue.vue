<template>
  <v-list v-if="value.isLoaded">
    <v-list-item>
      <k-avatar :value="value" :size="avatarSize" class="{avatarMxAuto: 'mx-auto'}"
                  @click="avatar_click" @dblclick="avatar_dblclick">
      </k-avatar>
    </v-list-item>
    <v-list-item v-if="!fio">
      <v-list-item-content>
        <v-list-item-title class="title">{{ value.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="locale">
      <v-list-item-content>
        <v-select ref="locale"
                  item-text="languageName"
                  item-value="name"
                  :readonly="readonly"
                  :return-object="true"
                  :allow-overflow="false"
                  v-model="value.locale"
                  :items="locales"
                  :auto-select-first="true"
                  label="Язык / Language"
                  @change="locale_change"
        >
        </v-select>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="fio">
      <v-list-item-content>
        <ValidationProvider name="firstName" rules="required" v-slot="{ errors, valid }">
          <v-text-field
            ref="firstName"
            v-model="value.firstName"
            :label="$t('profile.firstName')"
            :error-messages="errors"
            :success="valid"
            :readonly="readonly"
          ></v-text-field>
        </ValidationProvider>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="fio">
      <v-list-item-content>
<!--        <ValidationProvider name="patronymic" rules="required" v-slot="{ errors, valid }">-->
          <v-text-field
            v-model="value.patronymic"
            :label="$t('profile.patronymic')"
            :readonly="readonly"
          ></v-text-field>
<!--        </ValidationProvider>-->
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="fio">
      <v-list-item-content>
        <ValidationProvider name="lastName" rules="required" v-slot="{ errors, valid }">
          <v-text-field
            v-model="value.lastName"
            :label="$t('profile.lastName')"
            :error-messages="errors"
            :success="valid"
            :readonly="readonly"
          >
          </v-text-field>
        </ValidationProvider>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="birthYear">
      <v-list-item-content>
        <ValidationProvider name="birthYear" rules="required|numeric|length:4|min_value:1900|max_value:2020"
                            v-slot="{ errors, valid }">
          <v-text-field
            v-model="value.birthYear"
            :label="$t('profile.birthYear')"
            v-mask="['####']"
            :error-messages="errors"
            :success="valid"
            :readonly="readonly"
          ></v-text-field>
        </ValidationProvider>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="role">
      <v-list-item-content>
        <ValidationProvider name="role" rules="required" v-slot="{ errors, valid }">
          <v-radio-group v-model="value.role" :readonly="readonly">
            <template v-slot:label>
              <div>{{ $t('profile.role') }}</div>
            </template>
            <template v-for="(eachRole, eachRoleIndex) of $t('profile.roles')">
              <v-radio :value="eachRoleIndex+1" :label="eachRole.title" color="success"></v-radio>
              <ul v-show="value.role===eachRoleIndex+1" class="mb-4" style="font-size: smaller;">
                <li v-for="eachCriteria of eachRole.criteria" class="criteria">
                  <v-icon color="">mdi-checkbox-marked</v-icon>
                  {{ eachCriteria }}
                </li>
              </ul>
            </template>
          </v-radio-group>
        </ValidationProvider>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="passport">
      <v-list-item-content>
        <ValidationProvider name="passport" rules="required|numeric|length:4"
                            v-slot="{ errors, valid }">
          <v-text-field
            v-model="value.passport"
            v-mask="['####']"
            :label="$t('profile.passport')"
            :error-messages="errors"
            :success="valid"
            :readonly="readonly"
          ></v-text-field>
        </ValidationProvider>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="location">
      <v-list-item-content>
        <v-list-item-title class="mb-3" style="white-space: inherit !important;">{{ $t('profile.location') }}
        </v-list-item-title>
        <MapVue :key="'kopnik_'+value.id+'_map'"
                :center="value.location" :zoom="14"
                :zoom-control="true" :layers-control="false" :locate-control="true"
                @update:center="$emit('map_updateCenter', $event)"
                @move="map_move"
                class="" style="z-index: 0; height: 50vh;">
          <l-marker :lat-lng="value.location"></l-marker>
        </MapVue>
      </v-list-item-content>
    </v-list-item>
    <slot></slot>
  </v-list>
</template>
<script>
import {LMarker} from 'vue2-leaflet'
import Kopnik from "../models/Kopnik"
import MapVue from "./MapVue";
import KAvatar from "./KAvatar";
import logger from "./mixin/logger"
import {container} from "../bottle/bottle";
import {
  ValidationProvider,
} from "vee-validate"

export default {
  name: "Kopnik",
  mixins: [logger],
  components: {
    MapVue,
    LMarker,
    ValidationProvider,
    KAvatar,
  },
  data: () => {
    return {
      temp: true,
      application: container.application,
      locales: container.localeManager.locales,
    }
  },
  props: {
    avatarSize: {
      type: Number,
      default: 128
    },
    avatarTile: {
      type: Boolean,
      default: false
    },
    avatarMxAuto: {
      type: Boolean,
      default: false
    },
    value: {
      type: Kopnik
    },
    locale: {
      type: Boolean,
      default: false,
    },
    fio: {
      type: Boolean,
      default: false,
    },
    birthYear: {
      type: Boolean,
      default: false
    },
    passport: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object]
    },
    location: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    role: {
      type: Boolean,
      default: false,
    }
  },
  filters: {
    undefined(value) {
      return value === undefined ? '' : value
    }
  },
  computed: {},
  watch: {},
  methods: {
    map_move(event) {
      if (!this.readonly) {
        this.value.location = event.target.getCenter()
      }
      // console.log(event.target.getCenter())
    },
    /**
     * Здесь локаль не сохраняется на сервере, потому что этот компонент может отображать любого постороннего копника,
     * а api/users/setLocale() работает только для текущего пользователя
     * @param event
     */
    locale_change(event) {
      this.value.locale = event
      this.$emit('locale_change',  event)
    },
    role_click(value) {
      this.value.role = value
    },
    avatar_click() {
      this.$emit('click', this.value)
    },
    avatar_dblclick() {
      this.$emit('dblclick', this.value)
    },
  },
  async created() {
  },
  async mounted() {
    await this.value.loaded()
  }
}
</script>


<style>
li.criteria {
  list-style-type: none;
}

.v-input legend.v-label {
  height: auto;
}
</style>
