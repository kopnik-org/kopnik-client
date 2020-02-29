import flushPromises from "flush-promises";
import Vue from 'vue'
import { mount } from '@vue/test-utils'

import vuePlugins from "../../test-setup";
import KTen from "../../../src/components/KTen";
import {bottle, container} from "../../../src/bottle/bottle";
import {Kopnik} from "../../../src/models";
import ProfileVue from "../../../src/components/ProfileVue";
import Application from "../../../src/application/Application";

describe('unit components Profile', () => {
    beforeAll(async () => {
    })

    beforeEach(() => {
    })

    it('draw new', async () => {
        await login(2)
        const kopnik= Kopnik.getReference(2)
        await container.application.authenticate()
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        // expect(wrapper.vm.$el).toMatchSnapshot()
    })

    it('submit', async () => {
        await login(2)
        const kopnik= Kopnik.getReference(2)
        await container.application.authenticate()
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        const submitBtn= wrapper.find('#submit')
        submitBtn.trigger('click')
        await flushPromises()
        expect(container.application.section).toBe(Application.Section.Main)
    })
})
