import flushPromises from "flush-promises";
import Vue from 'vue'
import {mount} from '@vue/test-utils'
import waitForExpect from "wait-for-expect";

import vuePlugins, {routerFactory} from "../../../tests/test-setup";
import AppVue from "./KApp";
import {bottle, container} from "../../bottle/bottle";
import Application from "../../application/Application";

// real fetch
container.constants.di.fetch = true

describe('components AppVue', () => {
    let wrapper,
        application

    beforeEach(() => {
        bottle.resetProviders(['application', 'cookieService'])
        application = container.application
        application.authenticate()
        wrapper = mount(AppVue, {
            ...vuePlugins,
            router: routerFactory(),
        })
    })

    describe('anonymous', () => {
        it('render', async () => {
            await waitForExpect(() => {
                expect(application.user).toBeNull()
                expect(wrapper.text()).toContain('Войти через ВКонтакте')
            })
        })

        describe('enter', () => {
            it('/', async () => {
                await waitForExpect(() => {
                    expect(application.user).toBeNull()
                    expect(wrapper.text()).toContain('Войти через ВКонтакте')
                    expect(application.section).toBe(Application.Section.Main)
                })
            })
            it('/profile', async () => {
                try {
                    await wrapper.vm.$router.push({name: Application.Section.Profile})
                    throw new Error('should not be hire')
                } catch (err) {
                    expect(err.type).toBe(1)
                }
                expect(application.section).toBe(Application.Section.Main)
                expect(wrapper.vm.$router.currentRoute.name).toBe(Application.Section.Main)
                await flushPromises()
                expect(wrapper.text()).toContain('Войти через ВКонтакте')
            })
            it('/witness', async () => {
                try {
                    await wrapper.vm.$router.push({name: Application.Section.Witness})
                    throw new Error('should not be hire')
                } catch (err) {
                    expect(err.type).toBe(1)
                }
                expect(application.section).toBe(Application.Section.Main)
                expect(wrapper.vm.$router.currentRoute.name).toBe(Application.Section.Main)
                await flushPromises()
                expect(wrapper.text()).toContain('Войти через ВКонтакте')
            })
        })
    })
})
