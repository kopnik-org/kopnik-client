<template>
    <div>
        <span class="count">{{ count.count }}</span>
        <button @click="increment">Increment</button>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                // count:{
                //     count: 0
                // }
            }
        },
        props:{
            count:{
                type: Object,
            }
        },

        methods: {
            increment() {
                this.count.count++
            }
        }
    }
</script>
