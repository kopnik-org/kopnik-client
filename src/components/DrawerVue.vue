<template>
    <v-navigation-drawer :value="value" @input="drawer_input" app>
        <router-link to="/profile" class="cursor-pointer" tag="div">
            <kopnik-vue v-if="application.user" :value="application.user" to="/profile"
                        :avatar-size="150" class="flex-grow-1">
            </kopnik-vue>
        </router-link>
        <v-list :dense="false" subheader>
            <v-list-item link to="/">
                <v-list-item-action>
                    <v-icon>mdi-home-city</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Карта</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Моя десятка</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-chat</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Чат десятки</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-chat</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Чат старшины</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/witness">
                <v-list-item-action>
                    <v-icon>mdi-human-greeting</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Заявки на вступление</v-list-item-title>
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
                    <v-list-item-title>Благодарность</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-help-circle</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Подсказка</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item link @click="logout_click">
                <v-list-item-action>
                    <v-icon>mdi-location-exit</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Выход</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>

    import KopnikVue from "./KopnikVue";
    import {container} from "../plugins/bottle";

    export default {
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
                await container.fetchApi('logout')
                this.application.user= null
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
