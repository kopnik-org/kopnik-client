<template>
    <div class="d-flex flex-wrap justify-start align-start k-kopaInvite"
         :class="{'kopaInvite-long': $vuetify.breakpoint.smAndUp}">
        <v-badge v-for="eachAvatar of avatars" :key="eachAvatar.value.id" :content="eachAvatar.value.rank" bottom
                 color="orange" :offset-x="24" :offset-y="28">
            <v-avatar :value="eachAvatar.value"
                      :size="48" class="ml-1 mr-1 mb-2" :class="eachAvatar.className"
                      :title="eachAvatar.value.rankName"
                      @click="avatar_click(eachAvatar.value)" @dblclick="avatar_dblclick(eachAvatar.value)"
            >
                <v-img :src="eachAvatar.value.photo"></v-img>
            </v-avatar>
        </v-badge>
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
        computed: {
            avatars() {
                const result = this.value.parts
                    .map(eachPart => {
                        return {
                            value: eachPart,
                            className: 'map_avatar' + (this.application.user === eachPart ? ' map_avatar-user' : '') + (this.application.selected === eachPart ? ' map_avatar-selected' : ''),
                        }
                    })
                // console.log(result)
                return result
            },
        },
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

    .k-kopaInvite {
        width: $element-width*5;
        pointer-events: none;
        /*outline: solid 2px black;*/
    }

    .k-kopaInvite .v-avatar, .k-kopaInvite button {
        pointer-events: all;
    }

    .k-kopaInvite-long {
        width: $element-width*10;
    }

    .k-kopaInvite > .v-avatar {
        transition-property: box-shadow, transform, opacity;
    }
</style>
