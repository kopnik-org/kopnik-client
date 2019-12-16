<template>
    <v-list>
<!--        @click.native="$router.push(to)"-->
        <v-list-item>
            <v-list-item-avatar :tile="avatarTile" :size="avatarSize" class="mx-auto">
                <v-img src="https://slavyanskieoberegi.ru/wp-content/uploads/2017/05/3-%D0%B8%D1%8E%D0%BB%D1%8F-%E2%80%93-%D0%94%D0%B5%D0%BD%D1%8C-%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D0%B8-%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B3%D0%BE-%D0%A1%D0%B2%D1%8F%D1%82%D0%BE%D1%81%D0%BB%D0%B0%D0%B2%D0%B0.png"></v-img>
            </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    {{value.name}}
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
            elevation: {
                type: Number,
                default: 0
            },
            avatarSize: {
                type: Number,
                default: 150
            },
            avatarTile: {
                type: Boolean,
                default: false
            },
            value: {
                type: Object
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
