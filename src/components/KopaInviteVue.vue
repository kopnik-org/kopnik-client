<template>
    <div class="d-flex flex-wrap justify-start align-start kopaInvite"
         :class="{'kopaInvite-long': $vuetify.breakpoint.smAndUp}">
        <v-avatar v-for="eachPart of value.parts" :key="eachPart.id" :value="eachPart"
                  :size="48" class="ml-1 mr-1 mb-2"
                  :title="eachPart.rankName"
                  @click="avatar_click(eachPart)" @dblclick="avatar_dblclick(eachPart)">
            <v-img :src="eachPart.photo"></v-img>
        </v-avatar>

        <!--                    <div style="width: 100%">a</div>-->
        <!--                <v-responsive
                                v-if="eachPartIndex === 4"
                                key="5-responsive"
                                width="100%"
                        ></v-responsive>-->

        <slot></slot>
    </div>
</template>
<script>
    import _ from 'lodash'
    import {bottle, container} from "../plugins/bottle";
    import i18n from "../plugins/i18n";
    import logger from "./mixin/logger";
    import {Kopa, Kopnik} from "../models";

    export default {
        name: "KopaInvite",
        mixins: [logger],
        components: {},

        data() {
            return {
                application: container.application,
            }
        },
        props: {
            value: {
                type: Kopa
            }
        },
        computed: {},
        watch: {},
        methods: {
            avatar_click(event) {
                this.$emit('avatar_click', event)
                return false
            },
            avatar_dblclick(event) {
                this.$emit('avatar_dblclick', event)
                return false
            },
        },
        async created() {

        },
        async mounted() {

        }
    }
</script>
<style lang="scss">
    $avatar-size: 48px;
    $margin: 4px;
    $element-width: $margin+$avatar-size+$margin;

    .kopaInvite {
        width: $element-width*5;
        transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)
    }

    .kopaInvite-long {
        width: $element-width*10;
    }

    .kopaInvite > .v-avatar{
        box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
        transition-property: box-shadow, transform, opacity;
    }


</style>
