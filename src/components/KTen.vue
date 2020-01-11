<template>
    <v-container fluid class="fill-height k-ten flex-column align-center">
        <v-card elevation="12" class="mb-10" width="100%" max-width="350px">
            <!--            <v-card-title>
                            Моя десятка
                        </v-card-title>-->
            <div class="d-flex flex-wrap mt-2 justify-space-around">
                <template v-for="(eachDruzhe, eachDruzheIndex) of extendedTen">
                    <v-badge v-if="eachDruzhe" :key="eachDruzhe.id" :title="eachDruzhe.name"
                             class='k-badge-event-handler' color="red" :offset-x="(64/64)*7+14" :offset-y="(64/64)*7+14"
                    >
                        <div @click="druzhe_del(eachDruzhe)" slot="badge" style="cursor: pointer">x</div>
                        <AvatarVue :value="eachDruzhe"
                                   :size="64" class="mb-2">
                        </AvatarVue>
                    </v-badge>
                    <v-avatar v-else :key="-eachDruzheIndex"

                 :size="64" class="mb-2">
                        <v-icon :size="64">mdi-account</v-icon>
                    </v-avatar>
                </template>
            </div>
        </v-card>

        <transition-group v-if="application.user.tenRequests && application.user.tenRequests.length" name="list-complete" tag="div" class="mx-auto"
                          style="width: 100%; max-width:350px; position: relative;">
            <v-card v-for="eachRequest in value.tenRequests" :key="eachRequest.id"
                    elevation="12" class="mb-10 list-complete-item" style="width: 100%;">
                <kopnik-view :value="eachRequest" location></kopnik-view>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="success" class="flex"
                           @click="request_confirm(eachRequest)">
                        Принять в десятку
                    </v-btn>
                    <v-btn color="error" class="flex"
                           @click="request_decline(eachRequest)">
                        Отклонить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </transition-group>
        <div v-else class="overline font-weight-bold my-auto" style="font-size: 1.625rem !important; color: #BDBD">Заявок нет</div>
    </v-container>
</template>
<script>
    import Kopnik from "../models/Kopnik"
    import thanks from "../thanks";

    import KopnikView from './KopnikVue'
    import AvatarVue from "./AvatarVue";
    import logger from "./mixin/logger";
    import {container} from "../plugins/bottle";

    export default {
        name: "Ten",
        mixins: [logger],
        components: {
            KopnikView,
            AvatarVue,
        },
        data: () => {
            return {
                application: container.application,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            }
        },
        props: {
            value: {
                type: Kopnik,
                required: true
            }
        },
        computed: {
            extendedTen() {
                const result = [],
                    ten = this.application.user.ten
                for (let length = 0; length < 10; length++) {
                    result.push((ten !== undefined && ten.length >= length) ? ten[length] : null)
                }
                return result
            }
        },
        methods: {
            shuffle: function () {
                this.items.splice(0, 1)
                // this.items = _.shuffle(this.items)
            },
            request_confirm(request) {
                this.shuffle()
                const requests = this.application.user.tenRequests
                requests.splice(requests.indexOf(request), 1)
                this.application.user.ten.push(request)
            },
            request_decline(request) {
                const requests = this.application.user.tenRequests
                requests.splice(requests.indexOf(request), 1)
            },
            druzhe_del(druzhe) {
                const ten = this.application.user.ten
                ten.splice(ten.indexOf(druzhe), 1)
            }
        }
        ,
        async created() {
            // this.application.user.ten = [Kopnik.getReference(1), Kopnik.getReference(3), Kopnik.getReference(4)]
            this.application.user.tenRequests = [
                Kopnik.getReference(1), Kopnik.getReference(3), Kopnik.getReference(4),
            ]
        }
        ,
    }
</script>

<style>
    .k-badge-event-handler .v-badge__wrapper{
        pointer-events: all;
    }

    .list-complete-leave-active {
        position: absolute;
    }

    .list-complete-leave-to {
        opacity: 0;
        transform: translateX(100px);
    }

    .list-complete-item {
        transition: all .25s;
        display: inline-block;
        margin-right: 10px;
    }
</style>
