<template>
    <v-flex xs11 md6 xl4 mx-auto v-if="user">
        <v-card v-for="(eachWitnessRequest, index) in user.witnessRequests" :key="eachWitnessRequest.id"
                elevation="12" class="mb-10">
            <kopnik-view v-model="user.witnessRequests[index]" birth-year passport></kopnik-view>
            <v-card-actions>
                <v-btn @click="this_confirm(eachWitnessRequest)" class="flex-grow-1">{{$t('witness.witness')}}
                </v-btn>
                <v-btn @click="this_decline(eachWitnessRequest)" class="flex-grow-1">{{$t('witness.reject')}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>
<script>
    import KopnikView from "./KopnikVue"
    import {Kopnik} from "../models"
    import log from "./mixin/log"

    export default {
        name: "Witness",
        mixins: [log],
        components: {
            KopnikView
        },
        data: () => {
            return {
                user: null
            }
        },
        props: {},
        computed: {},
        watch: {},
        methods: {
            this_confirm(witnessRequest) {
                this.user.confirm(witnessRequest)
            },
            this_decline(witnessRequest) {
                this.user.decline(witnessRequest)
            }
        },
        async created() {
            this.user = global.app.user
            this.user.witnessRequests = await Promise.all([3].map(each => Kopnik.getReference(each).loaded()))
        },
        async mounted() {
        }
    }
</script>
