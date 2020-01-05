<template>
    <v-container fluid class="fill-height">
        <v-card v-for="(eachThank, eachThankIndex) in value" :key="eachThankIndex"
                elevation="12" class="mb-10 mx-auto" width="100%" max-width="350px">
            <kopnik-view :value="eachThank.who"></kopnik-view>
            <v-divider></v-divider>
            <v-list>
                <v-list-item v-for="(eachDeal, eachDealIndex) of eachThank.deals" :key="eachDealIndex">
                    <v-list-item-content>
                        <v-list-item-title :title="eachDeal.project">{{eachDeal.project}}</v-list-item-title>
                        <v-list-item-subtitle>{{eachDeal.role}}</v-list-item-subtitle>
                        <v-list-item-subtitle>{{eachDeal.results}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action v-if="eachDeal.link">
                        <a :href="eachDeal.link" target="_blank" style="text-decoration: inherit">
                            <v-btn icon @click="">
                                <v-icon>mdi-link</v-icon>
                            </v-btn>
                        </a>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-card>

        <div style="width: 100%"></div>

        <v-card elevation="12" class="mx-auto" width="100%" max-width="350px">
                <v-img src="https://technicalsupportoverseas.com/wp-content/uploads/revslider/AboutUs/slider-rev-about.png"></v-img>
            <v-card-title>
                Тоже хочешь участвовать?
            </v-card-title>
            <v-card-subtitle>
                Принять участие в создании первой международной сети Копного права очень просто. Узнай как присоединиться.
            </v-card-subtitle>
            <v-card-actions>
                <v-btn color="primary" @click="join_click" class="mx-auto">
                    Узнать как присоединиться
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<script>
    import Kopnik from "../models/Kopnik"
    import thanks from "../thanks";

    import KopnikView from './KopnikVue'
    import logger from "./mixin/logger";
    import {container} from "../plugins/bottle";

    export default {
        name: "Thanks",
        mixins: [logger],
        components: {
            KopnikView
        },
        data: () => {
            return {
                application: container.application,
                value: [],
            }
        },
        props: {},
        computed: {},
        watch: {},
        methods: {
            join_click() {
                window.open('https://docs.google.com/document/d/1NzlfhHoDkT9FBR1aH41bZZ_eZQeUH7kTGTXABpvY3YE/edit#heading=h.pn4ly25488lj')
            }
        },
        async created() {
            await this.application.resolveUser()
            this.value = thanks.map(eachThank => {
                let eachWho
                eachWho = new Kopnik()
                eachWho.id = eachThank.who.id
                eachWho.merge(eachThank.who)
                if (!eachThank.who.id || !this.application.user) {
                    eachWho.isLoaded = true
                }
                eachWho.firstName = eachThank.who.name
                eachThank.who = eachWho
                return eachThank
            })
        },
    }
</script>
