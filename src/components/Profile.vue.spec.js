import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins from "../../tests/test-setup";
import {bottle, container} from "../bottle";
import {AbstractSync, Kopnik} from "../models";
import ProfileVue from "./ProfileVue";
import Application from "../application/Application";
import KopnikVue from "./KopnikVue";
import Vue from 'vue'

// real fetch
container.constants.di.fetch = true

describe('unit components Profile', () => {
    /** @type {Kopnik} */
    let user
    /** @type {Application} */
    let application

    beforeAll(async () => {
    })

    beforeEach(async () => {
        bottle.resetProviders(['application', 'cookieService'])
        AbstractSync.clearCache()
        user = await Kopnik.create({
            status: Kopnik.Status.NEW,
        }, 'user')
        await user.login()
        // вызывается в mounted() компонента
        user.isMessagesFromGroupAllowed= jest.fn(()=>true)
        application= container.application
        await application.authenticate()
    })

    it('draw', async () => {
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
    })

    it('submit disabled by fio', async () => {
        user.patronymic = null
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        const submitBtn = wrapper.find('#submit')
        expect(submitBtn.attributes('disabled')).toBe('disabled')
    })

    it('submit disabled by messages not allowed', async () => {
        user.isMessagesFromGroupAllowed= jest.fn(()=>false)
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        const submitBtn = wrapper.find('#submit')
        expect(submitBtn.attributes('disabled')).toBe('disabled')
    })

    it('submit enabled', async () => {
        const wrapper = await mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        const submitBtn = wrapper.find('#submit')

        expect(submitBtn.attributes('disabled')).toBeUndefined()
    })

    it.only('submit', async () => {
        const wrapper = mount(ProfileVue, {
            ...vuePlugins,
        })
        await flushPromises()
        const submitBtn = wrapper.find('#submit')
        await submitBtn.trigger('click')
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
