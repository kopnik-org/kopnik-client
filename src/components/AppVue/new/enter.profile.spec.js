import Vue from 'vue'
import {i18n, vuetify, routerFactory} from "../../../../tests/test-setup";
import AppVue from "../../AppVue";
import {bottle, container} from "../../../bottle";
import flushPromises from "flush-promises";
import Application from "../../../application/Application";

describe('unit components AppVue', () => {
    let vm,
        application

    beforeEach(() => {
        bottle.resetProviders(['application', 'cookieService'])
        application = container.application
        const router= routerFactory()
        vm = new Vue({
            ...AppVue,
            i18n,
            vuetify,
            router
        })
    })

    describe('status=new', () => {
        beforeEach(async () => {
            await login(2)
        })

        describe('enter', () => {
            it('/profile', async () => {
                await vm.$router.push({name: Application.Section.Profile})
                application.authenticate()
                vm.$mount()

                await flushPromises()
                expect(vm.$router.currentRoute.name).toBe(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Profile)
                expect(vm.$el.textContent).toContain('Язык')
            })
        })
    })

})
