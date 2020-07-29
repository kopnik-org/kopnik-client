import flushPromises from "flush-promises";
import Vue from 'vue'

import KopnikVue from './KopnikVue'
import {AbstractSync,Kopnik} from "../models";
import vuePlugins from "../../tests/test-setup";
import {container} from "../bottle/bottle";
import {mount} from "@vue/test-utils";
import waitForExpect from "wait-for-expect";
import AvatarVue from "./AvatarVue";

// real fetch
container.constants.di.fetch = true

describe('unit components Kopnik', () => {
    /** @type {Kopnik} */
    let user

    beforeEach(async () => {
        AbstractSync.clearCache()
        user = await Kopnik.create({
            status: Kopnik.Status.NEW,
        }, 'user')
        await user.login()
    })

    it('render', async () => {
        const wrapper = mount(KopnikVue,{
            ...vuePlugins,
            propsData: {
                value: user,
                fio: true,
                birthyear: true,
                passport: true,
                location: true,
            }
        })
        await flushPromises()
        expect(wrapper.findComponent(AvatarVue)).toBeTruthy()
        // expect(vm.$el).toMatchSnapshot() // input.v-text-field--is-booted present on run debug, but not on console run
    })
    it('render short', async () => {
        const wrapper = mount(KopnikVue,{

            ...vuePlugins,
            propsData: {
                value: user,
            }
        })
        await flushPromises()
        expect(wrapper.find(AvatarVue)).toBeTruthy()
    })

    // ??? @change на v-select не срабатывает
    it.skip('locale', async () => {
        const en = container.localeManager.getLocaleByShortName('en')
        const wrapper = mount(KopnikVue, {
            ...vuePlugins,
            propsData: {
                value: await Kopnik.get(1),
                locale: true
            }
        })
        await flushPromises()
        const locale_changeSpy = spyOn(wrapper.vm, 'locale_change')
        const localeWrapper = wrapper.find(".v-select")
        localeWrapper.trigger('change', en)
        expect(locale_changeSpy).toBeCalled()
    })
})

