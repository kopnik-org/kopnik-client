<template>
    <v-flex xs11 md6 xl4 mx-auto>
        <v-card v-for="(eachThank, eachThankIndex) in value"
                elevation="12" class="mb-10">
            <kopnik-view :value="eachThank.who"></kopnik-view>
            <v-list>
                <v-list-item v-for="(eachDeal, eachDealIndex) of eachThank.deals">
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
    import log from "./mixin/log"
    import thanks from "../thanks";

    import KopnikView from './Kopnik'

    export default {
        name: "Thanks",
        mixins: [log],
        components: {
            KopnikView
        },
        data: () => {
            return {
            }
        },
        props: {},
        computed: {
            value() {
                return thanks.map(eachThank => {
                    let eachWho
                    if (eachThank.who.id) {
                        eachWho = Kopnik.getReference(eachThank.who.id)
                    } else {
                        eachWho = new Kopnik()
                        eachWho.firstName = eachThank.who.name
                        eachWho.phone = eachThank.who.photo
                        eachWho.isLoaded=true
                    }
                    eachThank.who= eachWho
                    return eachThank
                })
            }
        },
        watch: {},
        methods: {},
        async created() {
        },
        async mounted() {
        }
    }
</script>
