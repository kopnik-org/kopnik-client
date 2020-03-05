<template>
    <v-list v-if="value.isLoaded">
        <v-list-item>
            <avatar-vue :value="value" :size="avatarSize" class="{avatarMxAuto: 'mx-auto'}"
                          @click="avatar_click" @dblclick="avatar_dblclick">
            </avatar-vue>
        </v-list-item>
        <v-list-item v-if="!fio">
            <v-list-item-content>
                <v-list-item-title class="title">{{ value.name }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="locale">
            <v-list-item-content>
                <v-combobox ref="locale"
                            :readonly="readonly"
                            :return-object="false"
                            :allow-overflow="false"
                            v-model="value.locale"
                            :items="locales"
                            :auto-select-first="true"
                            label="Язык / Language"
                            @change="$emit('locale_change', $event)"
                >
                </v-combobox>
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
        <v-list-item v-if="fio">
            <v-list-item-content>
                <ValidationProvider name="firstName" rules="required" v-slot="{ errors, valid }">
                    <v-text-field
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
                <ValidationProvider name="patronymic" rules="required" v-slot="{ errors, valid }">
                    <v-text-field
                            v-model="value.patronymic"
                            :label="$t('profile.patronymic')"
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
                    <v-radio-group v-model="value.role">
                        <template v-slot:label>
                            <div>{{ $t('profile.role.title')}}</div>
                        </template>
                        <v-radio :value="1" :label="$t('profile.role.trueKopnik.title')">
                            <template v-slot:label>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.trueKopnik.criteria[0]') }}</v-checkbox>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.trueKopnik.criteria[1]') }}</v-checkbox>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.trueKopnik.criteria[2]') }}</v-checkbox>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.trueKopnik.criteria[3]') }}</v-checkbox>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.trueKopnik.criteria[4]') }}</v-checkbox>
                            </template>
                        </v-radio>
                        <v-radio :value="2" :label="$t('profile.role.danilovKopnik.title')">
                            <template v-slot:label>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.danilovKopnik.criteria[0]') }}</v-checkbox>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.danilovKopnik.criteria[1]') }}</v-checkbox>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.danilovKopnik.criteria[2]') }}</v-checkbox>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.danilovKopnik.criteria[3]') }}</v-checkbox>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.danilovKopnik.criteria[4]') }}</v-checkbox>
                            </template>
                        </v-radio>
                        <v-radio :value="3" :label="$t('profile.role.futureKopnik.title')">
                            <template v-slot:label>
                                <v-checkbox value="true" readonly color="success">{{ $t('profile.role.futureKopnik.criteria[0]') }}</v-checkbox>
                            </template>
                        </v-radio>
                        <v-radio :value="4" :label="$t('profile.role.women.title')">
                        </v-radio>
                    </v-radio-group>
                </ValidationProvider>
            </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="birthyear">
            <v-list-item-content>
                <ValidationProvider name="birthyear" rules="required|numeric|length:4"
                                    v-slot="{ errors, valid }">
                    <v-text-field
                            v-model="value.birthyear"
                            :label="$t('profile.birthyear')"
                            :v-mask="['####']"
                            :error-messages="errors"
                            :success="valid"
                            :readonly="readonly"
                    ></v-text-field>
                </ValidationProvider>
            </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="passport">
            <v-list-item-content>
                <ValidationProvider name="passport" rules="required|numeric|length:4"
                                    v-slot="{ errors, valid }">
                    <v-text-field
                            v-model="value.passport"
                            mask="####"
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
                <v-list-item-title  class="mb-3" style="white-space: inherit !important;">{{ $t('profile.location') }}</v-list-item-title>
                <MapVue :center="value.location" :zoom="14"
                        :zoom-control="true" :layers-control="false" :locate-control="true"
                        @update:center="$emit('map_updateCenter', $event)"
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
    import AvatarVue from "./AvatarVue";
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
            AvatarVue,
        },
        data: () => {
            return {
                application: container.application,
                locales: [
                    {
                        text: "Русский",
                        value: "ru"
                    },
                    {
                        text: "English",
                        value: "en"
                    }
                ],
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
            birthyear: {
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
            role:{
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
