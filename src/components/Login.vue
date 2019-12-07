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
        },ор мыши находится над внутренней частью ('fill') или над периметром ('stroke') элемента. Значение свойств visibility, fill и stroke не влияют на обработку события.
        Формальный синтаксис
    auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit
    Примеры
    Пример 1
    /* Пример 1: Сделать так, что бы все объекты img не реагировали на перетаскивание, наведение(:hover), нажатие(click) и т.д. */
    img {
        pointer-events: none;
    }
    Пример 2
    Сделать ссылку на ресурс http://example.com не реагирующей на нажатие(click), наведение(:hover) и т.д.

        <ul>
    <li><a href="https://developer.mozilla.org">MDN</a></li>
    <li><a href="http://example.com">example.com</a></li>
    </ul>
        async mounted() {
            VK.Widgets.Auth('vk_auth', {
                onAuth:data=>{
                    this.$root.app.setVkUser(data)
                    // this.$emit("login")
                    this.app.SECTION="Profile"
                }
            })
        }
    }
</script>
