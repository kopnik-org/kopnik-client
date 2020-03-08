import flushPromises from "flush-promises";
import Vue from 'vue'

import vuePlugins from "../../test-setup";
import ThanksVue from "../../../src/components/ThanksVue";
import {bottle, container} from "../../../src/bottle/bottle";

describe('unit components Thanks', () => {
    beforeAll(async () => {
    })

    beforeEach(() => {
        // удаляем, потому что ThanksVue пообует авторизоваться перед отрисовкой
        bottle.resetProviders(['application', 'cookieService'])
    })

    it('offline', async () => {
        const vm = new Vue({
            ...ThanksVue,
            ...vuePlugins,
        })
        vm.$mount()
        await flushPromises()
        // expect(vm.$el).toMatchSnapshot()
    })
    it('online', async () => {
        await login(1)

        const vm = new Vue({
            ...ThanksVue,
            ...vuePlugins,
        })
        vm.$mount()
        await flushPromises()
        // expect(vm.$el).toMatchSnapshot()
    })
})

