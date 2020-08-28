<template>
    <v-container fluid class="fill-height k-witness flex-column align-center">
        <v-card v-for="(eachRequest, index) in application.user.witnessRequests" :key="eachRequest.id"
                elevation="12" class="mb-10" width="100%" max-width="350px">
            <kopnik-view :value="eachRequest" locale fio birth-year passport role location readonly></kopnik-view>
            <v-card-actions>
                <v-btn  color="success" @click="updateRequestStatus_click(eachRequest, Status.CONFIRMED)" class="flex-grow-1"
                        v-promise-btn
                >
                    {{$t('witness.confirm')}}
                </v-btn>
                <v-btn color="error"  @click="updateRequestStatus_click(eachRequest, Status.DECLINED)" class="flex-grow-1"
                       v-promise-btn
                >
                    {{$t('witness.decline')}}
                </v-btn>
            </v-card-actions>
        </v-card>
        <div v-if="application.user.witnessRequests && !application.user.witnessRequests.length" class="overline font-weight-bold my-auto" style="font-size: 1.625rem !important; color: #BDBD">Заявок нет</div>
    </v-container>
</template>
<script>
    import KopnikView from "./KopnikVue"
    import {Kopnik} from "../models"
    import {container} from "../bottle/bottle";
    import logger from "./mixin/logger";

    export default {
        name: "Witness",
        mixins: [logger],
        components: {
            KopnikView
        },
        data: () => {
            return {
                application: container.application,
                Status: Kopnik.Status,
            }
        },
        props: {},
        computed: {},
        watch: {},
        methods: {
            /**
             *
             * @param {Kopnik} request
             * @param {Number} status
             * @returns {Promise<void>}
             */
            async updateRequestStatus_click(request, status) {
                request.status = status
                await this.application.user.updateWitnessRequestStatus(request)
            },
        },
        async created() {
            await container.application.user.reloadWitnessRequests()
        },
        async mounted() {
        }
    }
</script>
