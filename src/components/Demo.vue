<template>
    <div>{{ dog.age }}</div>
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
        }
    }
</script>
