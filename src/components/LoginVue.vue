<template>
    <v-layout login column align-center="true" justify-center="true"
              class="" style="position: fixed; left:0; right: 0; top: 0; bottom: 0; z-index: 100">
        <v-avatar size="150">
            <v-img  src="logo circle.png"></v-img>
        </v-avatar>
        <v-btn @click="login_click" class="mt-10">Войти через ВКонтакте</v-btn>
<!--        <div id="vk_auth" ></div>-->
    </v-layout>
</template>
<script>
    import Kopnik from "../models/Kopnik"
    import log from "./mixin/log"
    import {container} from "../plugins/bottle";

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
            login_click(){
                const loginWindow= window.open('https://dev.kopnik.org/connect/vkontakte', 'ВКонтакте', 'width=300,height=500', )
                loginWindow.addEventListener('close', ()=>alert('closed'))
                loginWindow.onclose= (e)=>alert('closed')

                let timer = setInterval(async () =>{
                    if(loginWindow.closed) {
                        clearInterval(timer);
                        await container.application.authenticate()
                    }
                }, 1000);
            }
        },
        async created() {
            // this.request = await this.$root.$options.app.user.loaded()
        },
        async mounted() {

/*            VK.Widgets.Auth('vk_auth', {
                onAuth:data=>{
                    delete data.session
                    localStorage.setItem("vkUser", JSON.stringify(data))
                    this.$root.app.setVkUser(data)
                }
            })*/
        }
    }
</script>
