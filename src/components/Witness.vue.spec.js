import flushPromises from "flush-promises";
import Vue from 'vue'
import { mount } from '@vue/test-utils'

import vuePlugins from "../../tests/test-setup";
import {container} from "../bottle";
import {Kopnik} from "../models";
import WitnessVue from "./WitnessVue";

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
        // expect(wrapper.vm.$el).toMatchSnapshot()
    })
})

