import Vue from 'vue'
import {i18n, vuetify, routerFactory} from "../../test-setup";
import AppVue from "../../../src/components/AppVue";
import {bottle, container} from "../../../src/plugins/bottle";
import flushPromises from "flush-promises";
import Application from "../../../src/Application";

describe('unit conponents AppVue', () => {
    let vm,
        application

    beforeEach(() => {
        bottle.resetProviders(['application', 'cookieService'])
        application = container.application
        vm = new Vue({
            ...AppVue,
            i18n,
            vuetify,
            router: routerFactory()
        })
    })

    describe('anonymous', () => {
        it('render', async () => {
            application.authenticate()
            vm.$mount()
            await flushPromises()
        })

        describe('enter', () => {
            it('/', async () => {
                application.authenticate()
                vm.$mount()
                await flushPromises()
                expect(vm.$el.textContent).toContain('Войти через ВКонтакте')
                expect(application.section).toBe(Application.Section.Main)
            })
            it('/profile', async () => {
                application.authenticate()
                vm.$mount()
                try {
                    await vm.$router.push({name: Application.Section.Profile})
                    throw new Error('should not be hire')
                } catch (err) {
                    expect(err).toBe(false)
                    await flushPromises()
                    expect(vm.$router.currentRoute.name).toBe(Application.Section.Main)
                    expect(application.section).toBe(Application.Section.Main)
                    expect(vm.$el.textContent).toContain('Войти через ВКонтакте')
                }
            })
            it('/Join', async () => {
                application.authenticate()
                vm.$mount()
                try {
                    await vm.$router.push({name: Application.Section.Join})
                    throw new Error('should not be hire')
                } catch (err) {
                    expect(err).toBe(false)
                    await flushPromises()
                    expect(vm.$router.currentRoute.name).toBe(Application.Section.Main)
                    expect(application.section).toBe(Application.Section.Main)
                    expect(vm.$el.textContent).toContain('Войти через ВКонтакте')
                }
            })
        })
    })

    // ожидаем users/list чтобы пожно было под разными пользователями заходить
    describe.skip('status=new', () => {
        beforeEach(async () => {
            await login(2)
        })

        it('render', async () => {
            application.authenticate()
            vm.$mount()
            await flushPromises()
        })

        describe('enter', () => {
            it('/', async () => {
                application.authenticate()
                vm.$mount()
                await flushPromises()
                expect(vm.$el.textContent).not.toContain('Войти через ВКонтакте')
                expect(application.section).toBe(Application.Section.Main)
            })
            it('/profile', async () => {
                application.authenticate()
                vm.$mount()
                    await vm.$router.push({name: Application.Section.Profile})
                    await flushPromises()
                    expect(vm.$router.currentRoute.name).toBe(Application.Section.Profile)
                    expect(application.section).toBe(Application.Section.Profile)
                    expect(vm.$el.textContent).toContain('Язык')
            })
            it('/Join', async () => {
                application.authenticate()
                vm.$mount()
                try {
                    await vm.$router.push({name: Application.Section.Join})
                    throw new Error('should not be hire')
                } catch (err) {
                    expect(err).toBe(false)
                    await flushPromises()
                    expect(vm.$router.currentRoute.name).toBe(Application.Section.Main)
                    expect(application.section).toBe(Application.Section.Main)
                    expect(vm.$el.textContent).toContain('Войти через ВКонтакте')
                }
            })
        })
    })

})
