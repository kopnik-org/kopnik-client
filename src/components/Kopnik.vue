<template>
    <v-card max-width="344">
        <v-avatar :tile="avatarTile" :size="avatarSize">
            <v-img src="https://slavyanskieoberegi.ru/wp-content/uploads/2017/05/3-%D0%B8%D1%8E%D0%BB%D1%8F-%E2%80%93-%D0%94%D0%B5%D0%BD%D1%8C-%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D0%B8-%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B3%D0%BE-%D0%A1%D0%B2%D1%8F%D1%82%D0%BE%D1%81%D0%BB%D0%B0%D0%B2%D0%B0.png"></v-img>
        </v-avatar>

        <v-card-title>
            FIO Top western road trips
        </v-card-title>

        <v-card-text>
            <v-text-field
                    v-model="value.lastName"
                    :label="$t('profile.lastName')"
            ></v-text-field>
            <v-text-field
                    v-model="value.firstName"
                    :label="$t('profile.firstName')"
            ></v-text-field>
            <v-text-field
                    v-model="value.patronymic"
                    :label="$t('profile.patronymic')"
            ></v-text-field>
            <v-text-field
                    v-model="value.nickname"
                    :label="$t('profile.nickname')"
            ></v-text-field>
            <v-text-field
                    v-model="value.birthyear"
                    :label="$t('profile.birthyear')"
            ></v-text-field>
            <v-text-field
                    v-model="value.passport"
                    :label="$t('profile.passport')"
            ></v-text-field>
        </v-card-text>
        <v-card-actions>
            <slot name="actions"></slot>
        </v-card-actions>
    </v-card>
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
                default: 64
            },
            avatarTile: {
                type: Boolean,
                default: false
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
