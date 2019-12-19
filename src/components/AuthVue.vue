<template>
    <div class="mx-auto">
        <v-icon size="300"></v-icon>
        <div id="vk_auth" ></div>
    </div>
</template>
<script>
    import Kopnik from "../models/Kopnik"
    import log from "./mixin/log"

    export default {
        name: "Login",
        mixins: [log],
        components: {
        },

        data: () => {
            return {
                user:null
            }
        },
        props: {},
        computed: {},
        watch: {},
        methods: {

        },
        async created() {
            // this.request = await this.$root.$options.app.user.loaded()
        },
        async mounted() {
            VK.Widgets.Auth('vk_auth', {
                onAuth:data=>{
                    delete data.session
                    localStorage.setItem("vkUser", JSON.stringify(data))
                    this.$root.app.setVkUser(data)
                }
            })
        }
    }
</script>
