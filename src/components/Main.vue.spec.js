import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../tests/test-setup";
import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import MainVue from "./MainVue";

// real fetch
container.constants.di.fetch = true

describe('components KMain', () => {
    let application, user

    beforeEach(async () => {
        bottle.resetProviders(['application', 'cookieService'])
        AbstractSync.clearCache()
        user = await Kopnik.create({
            status: Kopnik.Status.NEW,
        }, 'user')
        await user.login()
        application = container.application
        await application.authenticate()
    })

    it('draw', async () => {
        const wrapper = mount(MainVue, {
            ...vuePlugins,
            propsData:{
            }
        })
        await flushPromises()
        expect(wrapper.vm.lmap).not.toBeUndefined()
    })
})

