<template>
    <v-container fluid class="fill-height k-ten flex-column align-center">
        <v-card elevation="12" class="mb-10" width="100%" max-width="350px">
            <!--            <v-card-title>
                            Моя десятка
                        </v-card-title>-->
            <div class="d-flex flex-wrap mt-2 justify-space-around">
                <template v-for="(eachSubordinate, eachSubordinateIndex) of extendedSubordinates">
                    <v-badge v-if="eachSubordinate" :key="eachSubordinate.id" :title="eachSubordinate.name"
                             class='k-badge-event-handler' color="red" :offset-x="(64/64)*7+14" :offset-y="(64/64)*7+14"
                    >
                        <!--крестик-->
                        <div slot="badge"
                             :title="$t('ten.removeFromSubordinates')" style="cursor: pointer"
                             @click="removeFromSubordinates_click(eachSubordinate)"
                             >
                            x
                        </div>
                        <!--аватарка-->
                        <AvatarVue :value="eachSubordinate"
                                   :size="64" class="mb-2">
                        </AvatarVue>
                    </v-badge>
                    <v-avatar v-else :key="-eachSubordinateIndex"
                              :size="64" class="mb-2">
                        <v-icon :size="64">mdi-account</v-icon>
                    </v-avatar>
                </template>
            </div>
        </v-card>

        <transition-group v-if="application.user.foremanRequests && application.user.foremanRequests.length"
                          name="list-complete" tag="div" class="mx-auto"
                          style="width: 100%; max-width:350px; position: relative;">
            <v-card v-for="eachRequest in value.foremanRequests" :key="eachRequest.id"
                    elevation="12" class="mb-10 list-complete-item" style="width: 100%;">
                <kopnik-view :value="eachRequest" location></kopnik-view>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="success" class="flex"
                           @click="confirmForemanRequest_click(eachRequest)">
                        {{ $t('ten.confirmForemanRequest') }}
                    </v-btn>
                    <v-btn color="error" class="flex"
                           @click="declineForemanRequest_click(eachRequest)">
                        {{ $t('ten.rejectForemanRequest') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </transition-group>
        <div v-else class="overline font-weight-bold my-auto" style="font-size: 1.625rem !important; color: #BDBD">
            Заявок нет
        </div>
    </v-container>
</template>
<script>
    import Kopnik from "../models/Kopnik"
    import thanks from "../thanks";

    import KopnikView from './KopnikVue'
    import AvatarVue from "./AvatarVue";
    import logger from "./mixin/logger";
    import {container} from "../bottle";

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
                // items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            }
        },
        props: {
            value: {
                type: Kopnik,
                required: true
            }
        },
        computed: {
            extendedSubordinates() {
                const result = [],
                    ten = this.application.user.ten
                for (let length = 0; length < 10; length++) {
                    result.push((ten !== undefined && ten.length >= length) ? ten[length] : null)
                }
                return result
            }
        },
        methods: {
            // shuffle: function () {
            //     this.items.splice(0, 1)
            //     // this.items = _.shuffle(this.items)
            // },
            // принять подчиненного в десятку
            async confirmForemanRequest_click(request) {
                await container.application.user.confirmForemanRequest(request)
                container.application.infos.push(container.application.getMessage('ten.confirmForemanRequestInfo'))
            },
            // отказать войти в десятку
            async declineForemanRequest_click(request) {
                await container.application.user.declineForemanRequest(request)
                container.application.infos.push(container.application.getMessage('ten.declineForemanRequestInfo'))
            },
            // удалить подчиненного из десятки
            async removeFromSubordinates_click(user) {
                await container.application.user.removeFromSubordinates(user)
                container.application.infos.push(container.application.getMessage('ten.RemoveFromSubordinatesInfo'))
            }
        },
        async created() {
            // this.application.user.ten = [Kopnik.getReference(1), Kopnik.getReference(3), Kopnik.getReference(4)]
            // if (this.application.user.id === 2) {
            //     this.application.user.foremanRequests = [
            //         Kopnik.getReference(1), Kopnik.getReference(3), Kopnik.getReference(4),
            //     ]
            // }
        },
    }
</script>

<style>
    .k-badge-event-handler .v-badge__wrapper {
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
