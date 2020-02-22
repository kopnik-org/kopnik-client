import flushPromises from "flush-promises";
import Vue from 'vue'

import vuePlugins from "../../test-setup";
import {container} from "../../../src/bottle/bottle";
import {Kopnik} from "../../../src/models";
import WitnessVue from "../../../src/components/WitnessVue";

describe('unit components Witness', () => {
    beforeAll(async () => {
    })

    beforeEach(() => {
    })

    it('draw', async () => {
        await login(1)
        const kopnik= Kopnik.getReference(1)
        await container.application.authenticate()
        const vm = new Vue({
            ...WitnessVue,
            ...vuePlugins,
            propsData:{
            }
        })
        vm.$mount()
        await flushPromises()
        expect(vm.$el).toMatchSnapshot()
    })
})

