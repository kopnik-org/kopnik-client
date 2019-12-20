import Vue from "vue";

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const vueI18n= new VueI18n()
import {mount} from '@vue/test-utils'

import Demo from '../../../src/components/Demo'

it.skip('vue-i18n test', async () => {
    const wrapper = mount({
        vueI18n,
        ...Demo
    })
})

