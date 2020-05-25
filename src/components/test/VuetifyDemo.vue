<template>
    <div>{{ dog.age }}</div>
    <v-btn @click="btn_click"></v-btn>
</template>
<script>
    export default {
        data() {
            return {}
        },
        props:["dog"],
        computed:{
            dogAge(){
                return this.dog.age
            }
        },
        methods:{
            btn_click(){
                console.log('inside btn_click')
            }
        }
    }
</script>
