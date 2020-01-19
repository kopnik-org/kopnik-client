<template>
    <v-container fluid class="fill-height k-join flex-column align-center">
        <v-card v-for="(eachJoining, index) in application.user.joining" :key="eachJoining.id"
                elevation="12" class="mb-10" width="100%" max-width="350px">
            <kopnik-view :value="eachJoining" locale fio birth-year passport location></kopnik-view>
            <v-card-actions>
                <v-btn @click="updateJoiningStatus_click(eachJoining, Status.CONFIRMED)" class="flex-grow-1">
                    {{$t('Join.confirm')}}
                </v-btn>
                <v-btn @click="updateJoiningStatus_click(eachJoining, Status.DECLINED)" class="flex-grow-1">
                    {{$t('Join.decline')}}
                </v-btn>
            </v-card-actions>
        </v-card>
        <div v-if="application.user.joining && !application.user.joining.length" class="overline font-weight-bold my-auto" style="font-size: 1.625rem !important; color: #BDBD">Заявок нет</div>
    </v-container>
</template>
<script>
    import KopnikView from "./KopnikVue"
    import {Kopnik} from "../models"
    import {container} from "../plugins/bottle";
    import logger from "./mixin/logger";

    export default {
        name: "Join",
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
             * @param {Kopnik} joining
             * @param {Number} status
             * @returns {Promise<void>}
             */
            async updateJoiningStatus_click(joining, status) {
                joining.status = status
                await this.application.user.updateJoiningStatus(joining)
                this.application.user.joining.splice(application.user.joining.indexOf(joining), 1)
            },
        },
        async created() {
            await container.application.user.reloadJoining()
        },
        async mounted() {
        }
    }
</script>
