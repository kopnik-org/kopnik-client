<template>
    <v-container v-if="user">
        <v-card v-for="(eachWitnessRequest, index) in user.witnessRequests" :key="eachWitnessRequest.id"
                elevation="12" class="mb-3 mx-auto" width="100%" max-width="350px">
            <kopnik-view v-model="user.witnessRequests[index]" locale fio birth-year passport location></kopnik-view>
            <v-card-actions>
                <v-btn @click="patchWitnessRequest_click(eachWitnessRequest, Kopnik.Status.CONFIRMED)" class="flex-grow-1">{{$t('witness.confirm')}}
                </v-btn>
                <v-btn @click="patchWitnessRequest_click(eachWitnessRequest, Kopnik.Status.DECLINED)" class="flex-grow-1">{{$t('witness.decline')}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<script>
    import KopnikView from "./KopnikVue"
    import {Kopnik} from "../models"
    import {container} from "../plugins/bottle";
    import logger from "./mixin/logger";

    export default {
        name: "Witness",
        mixins: [logger],
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
            async patchWitnessRequest_click(witnessRequest, status) {
                await this.user.patchWitnessRequest(witnessRequest, status)
            },
        },
        async created() {
            await container.application.resolveUser()
            this.user = container.application.user
            this.user.witnessRequests = await Promise.all([3].map(each => Kopnik.getReference(each).loaded()))
        },
        async mounted() {
        }
    }
</script>
