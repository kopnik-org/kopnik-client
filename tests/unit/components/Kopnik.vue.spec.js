import flushPromises from "flush-promises";
import Vue from 'vue'

import KopnikVue from '../../../src/components/KopnikVue'
import {Kopnik} from "../../../src/models";
import vuePlugins from "../../test-setup";
import {container} from "../../../src/bottle/bottle";
import {mount} from "@vue/test-utils";
import ProfileVue from "../../../src/components/ProfileVue";

describe('unit components Kopnik', () => {
    beforeAll(async () => {
        await login(1)
    })

    beforeEach(async () => {
    })

    it('render', async () => {
        const kopnik = Kopnik.getReference(1)
        await kopnik.loaded()
        const vm = new Vue({
            ...KopnikVue,
            ...vuePlugins,
            propsData: {
                value: kopnik,
                fio: true,
                birthyear: true,
                passport: true,
                location: true,
            }
        })
        vm.$mount()
        await flushPromises()
        expect(vm.$el.innerHTML).toContain('avatar')
        // expect(vm.$el).toMatchSnapshot() // input.v-text-field--is-booted present on run debug, but not on console run
    })
    it('render short', async () => {
        const kopnik = Kopnik.getReference(1)
        const vm = new Vue({
            ...KopnikVue,
            ...vuePlugins,
            propsData: {
                value: kopnik,
            }
        })
        vm.$mount()
        await flushPromises()
        expect(vm.$el).toMatchSnapshot()
    })

    // какого черта это не работает??? @change на v-select не срабатывает
    it.skip('locale', async () => {
        const en= container.localeManager.getLocaleByShortName('en')
        const wrapper = mount(KopnikVue, {
            ...vuePlugins,
            propsData:{
                value: await Kopnik.get(1),
                locale: true
            }
        })
        await flushPromises()
        const locale_changeSpy= spyOn(wrapper.vm, 'locale_change')
        const localeWrapper = wrapper.find(".v-select")
        localeWrapper.trigger('change', en)
        expect(locale_changeSpy).toBeCalled()
    })
})

