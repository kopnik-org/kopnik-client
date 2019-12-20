<template>
    <v-flex xs11 md6 xl4 mx-auto v-if="request">
        <ValidationObserver ref="obs" v-slot="{ invalid, validated, passes, validate }">
            <v-card elevation="12">
                <v-card-text>
                    <v-form>
                        <v-combobox ref="locale"
                                    :return-object="false"
                                    :allow-overflow="false"
                                    v-model="$root.$options.i18n.locale"
                                    :items="locales"
                                    :auto-select-first="true"
                                    :label="$t('profile.language')"
                                    @change="locale_change"
                        ></v-combobox>
                        <ValidationProvider name="lastName" rules="required" v-slot="{ errors, valid }">
                            <v-text-field
                                    v-model="request.lastName"
                                    :label="$t('profile.lastName')"
                                    :error-messages="errors"
                                    :success="valid"
                                    required
                            ></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider name="firstName" rules="required" v-slot="{ errors, valid }">
                            <v-text-field
                                    v-model="request.firstName"
                                    :label="$t('profile.firstName')"
                                    :error-messages="errors"
                                    :success="valid"
                                    required
                            ></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider name="patronymic" rules="required" v-slot="{ errors, valid }">
                            <v-text-field
                                    v-model="request.patronymic"
                                    :label="$t('profile.patronymic')"
                                    :error-messages="errors"
                                    :success="valid"
                                    required
                            ></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider name="nickname" rules="" v-slot="{ errors, valid }">
                            <v-text-field
                                    v-model="request.nickname"
                                    :label="$t('profile.nickname')"
                                    :error-messages="errors"
                                    :success="valid"
                                    required
                            ></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider name="birthyear" rules="required|numeric|length:4"
                                            v-slot="{ errors, valid }">
                            <v-text-field
                                    v-model="request.birthyear"
                                    :label="$t('profile.birthyear')"
                                    :error-messages="errors"
                                    :success="valid"
                                    required
                            ></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider name="passport" rules="required|numeric|length:4"
                                            v-slot="{ errors, valid }">
                            <v-text-field

                                    v-model="request.passport"
                                    :counter="4"
                                    :label="$t('profile.passport')"
                                    :error-messages="errors"
                                    :success="valid"
                                    required
                            ></v-text-field>
                        </ValidationProvider>
                        <LMap ref="map" :center.sync="request.location" :zoom="14" class=""
                              style="z-index: 0; height: 50vh;">
                            <l-tile-layer ref="map"
                                          v-for="tileProvider in tileProviders"
                                          :key="tileProvider.name"
                                          :name="tileProvider.name"
                                          :visible="tileProvider.visible"
                                          :url="tileProvider.url"
                                          :attribution="tileProvider.attribution"
                                          :token="tileProvider.token"
                                          layer-type="base"/>
                            <l-marker :lat-lng="request.location"></l-marker>
                        </LMap>
                        <v-btn color="primary" block :disabled="false && ( invalid || !validated)"
                               @click="putWitnessRequest_click"
                               class="v-column v-col mt-12 xm-auto flex-align-center">
                            {{$t('profile.sendRequest')}}
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </ValidationObserver>
    </v-flex>
</template>
<script>
    import {
        LTooltip,
        LPopup,
        LIcon,
        LControlScale,
        LMap,
        LTileLayer,
        LMarker,
        LControlAttribution,
        LControlLayers,
        LControl
    } from 'vue2-leaflet'

    import {
        ValidationObserver,
        ValidationProvider,
        localize
    } from "vee-validate"

    import Kopnik from "../models/Kopnik"
    import log from "./mixin/log"
    import {container} from "../plugins/bottle";

    export default {
        $_veeValidate: {
            validator: 'new',
        },
        name: "Profile",
        mixins: [log],
        components: {
            LMap,
            LTileLayer,
            LMarker,
            ValidationProvider,
            ValidationObserver
        },

        data: () => {
            return {
                request: null,
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
                tileProviders: [
                    {
                        name: "OpenStreetMap",
                        visible: false,
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
                        token: null
                    },
                    {
                        name: "Dark",
                        visible: true,
                        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                        subdomains: "abcd",
                        token: null
                    },
                    {
                        name: "GIScience",
                        visible: false,
                        url: "https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png",
                        attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        subdomains: "abcd",
                        token: null
                    }
                ],
            }
        },
        props: {},
        computed: {},
        watch: {},
        methods: {
            putWitnessRequest_click() {
                this.$root.app.user.putWitnessRequest(this.request)
            },
            locale_change(event) {
                // вуетифи
                this.$vuetify.lang.current = event
                // валидация
                localize(event)
            }
        },
        async created() {
            let user = container.application.user
            if (user.id) {
                await user.loaded()
            } else {
                user.location = [55.753215, 37.622504]
            }

            this.request = user.plain
            if (!user.location || !user.location[0]) {
                this.request.location = [55.753215, 37.622504]
            }
        },
        async mounted() {
        }
    }
</script>
