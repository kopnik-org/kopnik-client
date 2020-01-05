<template>
    <v-badge :content="value.rank" bottom :offset-x="(size/64)*7+14" :offset-y="(size/64)*7+14"
             color="orange">
        <v-avatar :size="size"
                  @click="$emit('click', $event)" @dblclick="$emit('dblclick', $event)">
            <img :src="value.photo" style="object-fit: cover; "/>
        </v-avatar>
    </v-badge>
</template>
<script>
    import logger from "./mixin/logger"
    import {Kopnik} from "../models";

    export default {
        name: "Avatar",
        mixins: [logger],
        components: {
        },
        data: () => {
            return {
            }
        },
        props: {
            size: {
                type: Number,
                default: 48
            },
            value: {
                type: Kopnik
            },
        },
        async created() {
            await this.value.loaded()
        },
        async mounted() {
        }
    }
</script>
