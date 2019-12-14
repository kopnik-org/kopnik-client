<template>
    <div>
        <kopnik-view v-for="eachWitness of value" v-model="eachWitness" v-key="eachWitness.id">
            <template v-slot="actions">
                <v-btn title="">{{$t('witness.witness')}}</v-btn>
                <v-btn title="">{{$t('witness.reject')}}</v-btn>
            </template>
        </kopnik-view>
    </div>
</template>
<script>
    import KopnikView from "./Kopnik"
    import Kopnik from "../models/Kopnik"
    import log from "./mixin/log"

    export default {
        name: "Kopnik",
        mixins: [log],
        components: {
            KopnikView
        },
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
