import flushPromises from "flush-promises";
import Vue from 'vue'
import { mount } from '@vue/test-utils'

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
        await container.application.authenticate()
        const wrapper = mount(WitnessVue, {
            ...vuePlugins,
            propsData:{
            }
        })
        await flushPromises()
        expect(wrapper.vm.$el).toMatchSnapshot()
    })
})

