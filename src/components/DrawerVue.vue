<template>
    <v-navigation-drawer :value="value" temporary touchless
                         @input="drawer_input" app>
        <router-link to="/profile" class="cursor-pointer" tag="div">
            <kopnik-vue v-if="application.user" :value="application.user" to="/profile"
                        :avatar-size="64" class="flex-grow-1">
            </kopnik-vue>
        </router-link>
        <v-divider></v-divider>
        <v-list>

            <v-list-item link to="/">
                <v-list-item-action>
                    <v-icon>mdi-home-city</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('drawer.map') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/ten">
                <v-list-item-action>
                    <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('drawer.myTen') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-chat</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('drawer.tenChat') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-chat</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('drawer.foremanChat') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/Witness">
                <v-list-item-action>
                    <v-icon>mdi-human-greeting</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('drawer.witnessRequests') }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-icon>mdi-account-question</v-icon>
                </v-list-item-action>
            </v-list-item>
            <v-list-item link to="/thanks">
                <v-list-item-action>
                    <v-icon>mdi-heart</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('drawer.thanks') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-help-circle</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('drawer.help') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item logout link @click="logout_click">
                <v-list-item-action>
                    <v-icon>mdi-location-exit</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ $t('drawer.logout') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>

    import KopnikVue from "./KopnikVue";
    import {container} from "../bottle/bottle";
    import logger from "./mixin/logger";

    export default {
        mixins:[logger],
        components: {
            KopnikVue,
        },
        data(){
            return {
                application: container.application,
            }
        },
        props:{
          value: {
              type:Boolean
          }
        },
        methods:{
            drawer_input(event) {
                // console.log('event', event)
                this.$emit('input', event)
            },
            async logout_click(){
                await this.application.logout()
            }
        },
        async created() {
                await this.application.resolveUser()
        }
    }
</script>

<style scoped>
    .cursor-pointer{
        cursor: pointer;
    }
</style>
