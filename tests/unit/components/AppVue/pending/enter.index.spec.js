import Vue from 'vue'
import {i18n, vuetify, routerFactory} from "../../../../test-setup";
import AppVue from "../../../../../src/components/AppVue";
import {bottle, container} from "../../../../../src/bottle/bottle";
import flushPromises from "flush-promises";
import Application from "../../../../../src/application/Application";

describe('unit components AppVue status=pending', () => {
    let vm,
        application

    beforeEach(async () => {
        bottle.resetProviders(['application', 'cookieService'])
        application = container.application
        const router = routerFactory()
        vm = new Vue({
            ...AppVue,
            i18n,
            vuetify,
            router
        })
        await login(3)
    })

    describe('enter', () => {
        it('/', async () => {
            vm.$mount()
            await application.authenticate()
            await flushPromises()
            expect(vm.$el.textContent).not.toContain('Войти через ВКонтакте')
            expect(application.section).toBe(Application.Section.Main)
            expect(vm.$route.name).toBe('Main')
            expect(application.infos.length).toBe(1)
        })
    })
})
