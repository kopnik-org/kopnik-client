<template>
    <v-flex xs11 md6 xl4 mx-auto>
        <v-card v-for="(eachThank, eachThankIndex) in value"  :key="eachThankIndex"
                elevation="12" class="mb-10">
            <kopnik-view :value="eachThank.who"></kopnik-view>
            <v-divider></v-divider>
            <v-list>
                <v-list-item v-for="(eachDeal, eachDealIndex) of eachThank.deals" :key="eachDealIndex">
                    <v-list-item-content>
                        <v-list-item-title>{{eachDeal.project}}</v-list-item-title>
                        <v-list-item-subtitle>{{eachDeal.role}}</v-list-item-subtitle>
                        <v-list-item-subtitle>{{eachDeal.results}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>
    </v-flex>
</template>
<script>
    import Kopnik from "../models/Kopnik"
    import thanks from "../thanks";

    import KopnikView from './KopnikVue'
    import logger from "./mixin/logger";

    export default {
        name: "Thanks",
        mixins: [logger],
        components: {
            KopnikView
        },
        data: () => {
            return {
                value: []
            }
        },
        props: {},
        computed: {},
        watch: {},
        methods: {},
        async created() {
            this.value = thanks.map(eachThank => {
                let eachWho
                if (eachThank.who.id) {
                    eachWho = Kopnik.getReference(eachThank.who.id)
                } else {
                    eachWho = new Kopnik()
                    eachWho.firstName = eachThank.who.name
                    eachWho.photo = eachThank.who.photo
                    eachWho.isLoaded = true
                }
                eachThank.who = eachWho
                return eachThank
            })
        },
        async mounted() {
        }
    }
</script>
