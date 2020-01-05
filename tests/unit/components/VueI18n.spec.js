import Vue from "vue";

import VueI18n from 'vue-i18n'
import i18n from "../../../src/plugins/i18n";

Vue.use(VueI18n)
const vueI18n = new VueI18n()
import {mount} from '@vue/test-utils'

import I18n from '../../../src/components/I18n'

it('vue-i18n test', async () => {
    const wrapper = mount({
        i18n,
        ...I18n
    })
})

it('direct vue', async () => {
    const vm = new Vue({
        i18n,
        ...I18n
    }).$mount()

    expect(vm.$el.textContent).toBe("Язык")
})
