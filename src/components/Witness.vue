<template>
    <v-flex xs11 md6 xl4 mx-auto v-if="user">
        <kopnik-view v-for="(eachWitnessRequest, index) in user.witnessRequests" :key="eachWitnessRequest.id"
                     v-model="user.witnessRequests[index]"
                     :avatar-size="200" class="mb-10">
            <template v-slot:actions>
                <v-btn @click="this_confirm(eachWitnessRequest)" class="flex-grow-1">{{$t('witness.witness')}}</v-btn>
                <v-btn @click="this_decline(eachWitnessRequest)" class="flex-grow-1">{{$t('witness.reject')}}</v-btn>
            </template>
        </kopnik-view>
    </v-flex>
</template>
<script>
    import KopnikView from "./Kopnik"
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
                user:null
            }
        },
        props: {
        },
        computed: {},
        watch: {},
        methods: {
            this_confirm(witnessRequest){
                this.user.confirm(witnessRequest)
            },
            this_decline(witnessRequest){
                this.user.decline(witnessRequest)
            }
        },
        async created() {
            this.user= this.$root.$data.app.user
            this.user.witnessRequests=await Promise.all([1,2,3].map(each=>Kopnik.getReference(each).loaded()))
            console.log(1243)
        },
        async mounted() {
        }
    }
</script>
