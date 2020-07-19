<template>
    <v-container fluid class="fill-height">

    </v-container>
</template>
<script>
    import Kopnik from "../models/Kopnik"
    import thanks from "../thanks";

    import KopnikView from './KopnikVue'
    import logger from "./mixin/logger";
    import {container} from "../bottle/bottle";

    export default {
        name: "Thanks",
        mixins: [logger],
        components: {
            KopnikView
        },
        data: () => {
            return {
                application: container.application,
                value: [],
            }
        },
        props: {},
        computed: {},
        watch: {},
        methods: {
            join_click() {
                window.open('https://docs.google.com/document/d/1NzlfhHoDkT9FBR1aH41bZZ_eZQeUH7kTGTXABpvY3YE/edit#heading=h.pn4ly25488lj')
            }
        },
        async created() {
            await this.application.resolveUser()
            this.value = thanks.map(eachThank => {
                let eachWho
                eachWho = new Kopnik()
                eachWho.id = eachThank.who.id
                eachThank.who.locale= container.localeManager.currentLocale
                eachWho.merge(eachThank.who)
                if (!eachThank.who.id || !this.application.user) {
                    eachWho.isLoaded = true
                }
                eachWho.firstName = eachThank.who.name
                eachThank.who = eachWho
                return eachThank
            })
        },
    }
</script>
