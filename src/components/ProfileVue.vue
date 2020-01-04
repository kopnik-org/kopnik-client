<template>
    <v-container v-if="request"
                 fluid class="fill-height">
        <ValidationObserver ref="obs" v-slot="{ invalid, validated, passes, validate }"
                            class="mx-auto " width="100%" max-width="350px">
            <v-card elevation="12">
                <v-card-text>
                    <v-form>
                        <kopnik-vue :value="request"
                                    locale fio birthyear passport location
                                    @locale_change="locale_change" @map_updateCenter="map_updateCenter"
                        ></kopnik-vue>
                        <v-btn color="primary" block :disabled="false && ( invalid || !validated)"
                               @click="putWitnessRequest_click"
                        >
                            {{$t('profile.sendRequest')}}
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </ValidationObserver>
    </v-container>
</template>
<script>
    import {
        ValidationObserver,
        localize
    } from "vee-validate"

    import {Kopnik} from "../models"
    import {container} from "../plugins/bottle";
    import logger from "./mixin/logger";
    import KopnikVue from "./KopnikVue";

    export default {
        mixins: [logger],
        name: "Profile",
        components: {
            ValidationObserver,
            KopnikVue,
        },

        data() {
            return {
                application: container.application,
                request: null,
            }
        },
        props: {},
        computed: {},
        watch: {},
        methods: {
            map_updateCenter(event) {
                this.request.location = event
            },
            async putWitnessRequest_click() {
                await this.application.user.putWitnessRequest(this.request)
            },
            async locale_change(event) {
                // vue-i18n
                this.$root.$options.i18n.locale = event
                // vuetify
                this.$vuetify.lang.current = event
                // vee-validate
                localize(event)
                // сохранить на сервере
                // await this.application.user.patchLocale()
            }
        },
        async created() {
            let user = this.application.user
            if (user.id) {
                await user.loaded()
            }

            this.request = new Kopnik
            this.request.merge(this.application.user.plain)
            if (!this.request.location || !this.request.location[0]) {
                this.request.location = [55.753215, 37.622504]
            }
        },
        async mounted() {
        }
    }
</script>
