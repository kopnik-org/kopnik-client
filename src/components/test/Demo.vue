<template>
    <div>
        <div>{{ dog.age }}</div>
        <v-btn @click="btn_click"></v-btn>
        <v-select ref="select" @change="select_change" :items="[1,2,3]" v-model="selectValue"></v-select>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                selectValue: 1,
            }
        },
        props: ["dog"],
        computed: {
            dogAge() {
                return this.dog.age
            }
        },
        methods: {
            btn_click() {
                console.log('inside btn_click')
            },
            select_change() {
                console.log('inside select_change')
            }
        }
    }
</script>
