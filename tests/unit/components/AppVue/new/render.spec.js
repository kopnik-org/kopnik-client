import Vue from 'vue'
import {i18n, vuetify, routerFactory} from "../../../../test-setup";
import AppVue from "../../../../../src/components/AppVue";
import {bottle, container} from "../../../../../src/bottle/bottle";
import flushPromises from "flush-promises";
import Application from "../../../../../src/application/Application";

describe('unit components AppVue', () => {
    let vm,
        application

    beforeEach(() => {
        bottle.resetProviders(['application', 'cookieService'])
        application = container.application
        const router = routerFactory()
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
        it('render', async () => {
            vm.$mount()
            application.authenticate()
            await flushPromises()
        })
    })
})
