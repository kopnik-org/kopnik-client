<template>
    <v-list>
<!--        @click.native="$router.push(to)"-->
        <v-list-item>
            <v-list-item-avatar :tile="avatarTile" :size="avatarSize" class="{avatarMxAuto: 'mx-auto'}">
                <img :src="value.photo" style="object-fit: cover; "/>
            </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    {{value.lastName }} {{value.firstName }} {{value.patronymic }}
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="birthYear">
            <v-text-field v-model="value.birthyear" :label="$t('profile.birthyear')" readonly></v-text-field>
        </v-list-item>
        <v-list-item v-if="passport">
            <v-text-field v-model="value.passport" :label="$t('profile.passport')" readonly></v-text-field>
        </v-list-item>
    </v-list>
</template>
<script>
    import Kopnik from "../models/Kopnik"
    import log from "./mixin/log"

    export default {
        name: "Kopnik",
        mixins: [log],
        components: {},
        data: () => {
            return {}
        },
        props: {
            avatarSize: {
                type: Number,
                default: 150
            },
            avatarTile: {
                type: Boolean,
                default: false
            },
            avatarMxAuto:{
                type: Boolean,
                default: false
            },
            value: {
                type: Kopnik
            },
            birthYear: {
                type: Boolean,
                default: false
            },
            passport: {
                type: Boolean,
                default: false
            },
            to:{
                type: [String, Object]
            },
        },
        filters:{
          undefined(value){
              return value===undefined?'':value
          }
        },
        computed: {},
        watch: {},
        methods: {},
        async created() {
            await this.value.loaded()
        },
        async mounted() {
        }
    }
</script>
