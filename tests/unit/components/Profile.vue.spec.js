import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins from "../../test-setup";
import {bottle, container} from "../../../src/bottle/bottle";
import {Kopnik} from "../../../src/models";
import ProfileVue from "../../../src/components/ProfileVue";
import Application from "../../../src/application/Application";
import KopnikVue from "../../../src/components/KopnikVue";

describe('unit components Profile', () => {
    beforeAll(async () => {
    })

    beforeEach(() => {
        bottle.resetProviders(['application'])
    })

    it('draw new', async () => {
        await login(2)
        const kopnik = Kopnik.getReference(2)
        await container.application.authenticate()
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        // expect(wrapper.vm.$el).toMatchSnapshot()
    })

    it('submit disabled', async () => {
        await login(2)
        const kopnik = Kopnik.getReference(2)
        await container.application.authenticate()
        kopnik.patronymic = null
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        const submitBtn = wrapper.find('#submit')
        await flushPromises()
        expect(submitBtn.attributes('disabled')).toBe('disabled')
    })

    it('submit enabled', async () => {
        await login(2)
        const kopnik = await Kopnik.get(2)
        kopnik.role = 1
        await container.application.authenticate()
        kopnik.patronymic = 'qwertyujhgfdjklxc'
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        const submitBtn = wrapper.find('#submit')
        await flushPromises()
        expect(submitBtn.attributes('disabled')).toBeUndefined()
    })


    it('submit', async () => {
        await login(2)
        const kopnik = Kopnik.getReference(2)
        await container.application.authenticate()
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        const submitBtn = wrapper.find('#submit')
        submitBtn.trigger('click')
        await flushPromises()
        expect(container.application.section).toBe(Application.Section.Main)
        expect(container.application.infos.length).toBe(1)
    })

    it('submit self-witness', async () => {
        await login(2)
        const kopnik = await Kopnik.get(2)
        kopnik.witness= kopnik
        await container.application.authenticate()
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        const submitBtn = wrapper.find('#submit')
        submitBtn.trigger('click')
        await flushPromises()
        expect(container.application.section).toBe(Application.Section.Main)
        expect(container.application.infos.length).toBe(1)
    })

    // какого черта это не работает??? @change на v-select не срабатывает
    it('locale', async () => {
        const en= container.localeManager.getLocaleByShortName('en')

        await login(2)
        await container.application.authenticate()
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        const kopnikWrapper= wrapper.find(KopnikVue)
        const locale_changeSpy= spyOn(kopnikWrapper.vm, 'locale_change')
        const localeWrapper = wrapper.find(".v-select")
        localeWrapper.trigger('change', en)
        await flushPromises()
        expect(locale_changeSpy).toBeCalled()
        expect(container.localeManager.currentLocale).toBe(en)
        expect(container.application.user.locale).toBe(en)
    })
    // какого черта это не работает??? @locale_change на KopnikVue не срабатывает
    it.skip('locale change_locale', async (done) => {
        const en= container.localeManager.getLocaleByShortName('en')

        await login(2)
        await container.application.authenticate()
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        const kopnikWrapper = wrapper.find(KopnikVue)
        kopnikWrapper.trigger('locale_change', en)
        await flushPromises()
        // expect(container.localeManager.currentLocale).toBe(en)
        // expect(container.application.user.locale).toBe(en)
    })
})
