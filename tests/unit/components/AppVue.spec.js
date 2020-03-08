import Vue from 'vue'
import {i18n, vuetify, routerFactory} from "../../test-setup";
import AppVue from "../../../src/components/AppVue";
import {bottle, container} from "../../../src/bottle/bottle";
import flushPromises from "flush-promises";
import Application from "../../../src/application/Application";
import {createLocalVue, mount} from "@vue/test-utils";
import _ from 'lodash'

import VueRouter from "vue-router";
import VueTheMask from 'vue-the-mask'
import VueI18n from 'vue-i18n'

describe('unit conponents AppVue', () => {
    let vm,
        application

    beforeEach(() => {
        bottle.resetProviders(['application', 'cookieService'])
        console.log('inside before each')
        application = container.application
        const router= routerFactory()
        const temp= _.cloneDeep(AppVue)

        ///
        const localVue= createLocalVue()
        localVue.use(VueRouter)
        localVue.use(VueTheMask)
        localVue.use(VueI18n)
        const wrapper= mount(temp, {
            localVue,
            i18n,
            vuetify,
            router
        })
        vm= wrapper.vm
        ///

/*        vm = new Vue({
            ...AppVue,
            i18n,
            vuetify,
            router
        })*/
    })

    afterEach(()=>{
        vm.$destroy()
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
            it('/witness', async () => {
                application.authenticate()
                vm.$mount()
                try {
                    await vm.$router.push({name: Application.Section.Witness})
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
    describe('status=new', () => {
        beforeEach(async () => {
            await login(2)
        })

        it.skip('render', async () => {
            application.authenticate()
            vm.$mount()
            await flushPromises()
        })

        // TODO: why this tests fail???
        describe('enter', () => {
            it.only('/', async () => {
                console.log('---> inside test 1')
                vm.$mount()
                await application.authenticate()
                await flushPromises()
                expect(vm.$el.textContent).not.toContain('Войти через ВКонтакте')
                expect(application.section).toBe(Application.Section.Profile)
                expect(vm.$route.name).toBe('Profile')
                console.log('inside test 1')
            })
            it.only('/profile', async () => {
                console.log('inside test 2')
                await vm.$router.push({name: Application.Section.Profile})
                application.authenticate()
                vm.$mount()

                await flushPromises()
                expect(vm.$router.currentRoute.name).toBe(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Profile)
                expect(vm.$el.textContent).toContain('Язык')
            })
            it.skip('/witness', async () => {
                application.authenticate()
                vm.$mount()
                try {
                    await vm.$router.push({name: Application.Section.Witness})
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
