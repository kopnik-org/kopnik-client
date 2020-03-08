<template>
    <v-container v-if="request"
                 fluid class="fill-height">
        <ValidationObserver ref="obs" v-slot="{ invalid, validated, passes, validate }"
                            tag="div" class="mx-auto" style="width: 100%; max-width:350px">
            <v-card elevation="12">
                <v-card-text>
                    <v-form>
                        <kopnik-vue :value="request"
                                    locale fio birthyear passport role location
                                    @locale_change="locale_change"
                                    @map_move="map_move"
                        ></kopnik-vue>
                        <v-list v-if="isMessagesFromGroupAllowed===false">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title style="white-space: inherit !important;">{{
                                        $t('profile.messagesFromGroup.allow') }}
                                    </v-list-item-title>
                                    <!-- VK Widget https://vk.com/dev/AllowMessagesFromCommunity https://vk.com/dev/widget_allow_messages_from_community -->
                                    <div id="vk_allow_messages_from_community" class="text-center my-3"></div>
                                </v-list-item-content>
                            </v-list-item>
                            <slot></slot>
                        </v-list>
                        <v-btn id='submit' color="primary" block
                               :disabled="invalid || !isMessagesFromGroupAllowed || !request.location.lat"
                               @click="submit_click"
                        >
                            {{$t('profile.submit')}}
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
    import {container} from "../bottle/bottle";
    import logger from "./mixin/logger";
    import KopnikVue from "./KopnikVue";

    export default {
        mixins: [logger],
        name: "Profile2",
        components: {
            ValidationObserver,
            KopnikVue,
        },

        data() {
            return {
                application: container.application,
                request: null,
                // в текущий момент
                isMessagesFromGroupAllowed: undefined,
                // при инициализации страницы
                wasMessagesFromGroupAllowed: undefined,
            }
        },
        props: {},
        computed: {},
        watch: {},
        methods: {
            map_move(event) {
                this.request.location = event.target.getCenter()
                // console.log(event.target.getCenter())
            },
            async submit_click() {
                await this.application.user.update(this.request.plain)
                this.application.infos.push(this.$t('profile.successMessage'))
                await this.application.setSection(container.application.constructor.Section.Main)
            },
            /**
             *
             * @param {{text:string, value:string}}event
             * @returns {Promise<void>}
             */
            async locale_change(event) {
                // задаем локаль текущему пользователю
                this.application.user.locale=event
                // задаем текущую локаль приложению
                container.localeManager.currentLocale= event
                // меняем сообщения в разметке страниц
                this.$root.$options.i18n.locale = event.name
                // меняем сообщения в разметке vuetify
                this.$vuetify.lang.current = event.name
                // меняем сообщения об ошибках валидации
                localize(event.name)
                // сохраняем на сервере
                // await this.application.user.patchLocale()
            }
        },
        async created() {
            let user = await this.application.resolveUser()

            this.request = new Kopnik
            this.request.merge(this.application.user)
            if (!this.request.location || !this.request.location.lat) {
                this.request.location = {lat: 55.753215, lng: 37.622504}
            }
        },
        async mounted() {
            this.wasMessagesFromGroupAllowed = this.isMessagesFromGroupAllowed = await this.application.user.isMessagesFromGroupAllowed()
            // https://vk.com/dev/widget_allow_messages_from_community
            if (!this.isMessagesFromGroupAllowed) {
                container.VK.Widgets.AllowMessagesFromCommunity("vk_allow_messages_from_community", {height: 30}, 144968351);
                container.VK.Observer.subscribe("widgets.allowMessagesFromCommunity.allowed", (userId) => {
                    this.isMessagesFromGroupAllowed = true
                })
                container.VK.Observer.subscribe("widgets.allowMessagesFromCommunity.denied", (userId) => {
                    this.isMessagesFromGroupAllowed = false
                })
            }
        },
        beforeDestroy() {
            container.VK.Observer.unsubscribe("widgets.allowMessagesFromCommunity.allowed")
            container.VK.Observer.unsubscribe("widgets.allowMessagesFromCommunity.denied")
        },
    }
</script>
