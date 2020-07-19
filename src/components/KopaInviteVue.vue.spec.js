import Vue from 'vue'
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../tests/test-setup";
import KopaInviteVue from './KopaInviteVue'
import {Kopnik, Kopa, AbstractSync} from "../models";
import flushPromises from "flush-promises";
import {bottle, container} from "../bottle/bottle";

// real fetch
container.constants.di.fetch = true

describe('components KopaInviteVue.vue',  () => {
    /** @type {Kopnik} */
    let user
    /** @type {Kopa} */
    let kopa
    /** @type {Application} */
    let application

    beforeEach(async () => {
        bottle.resetProviders(['application', 'cookieService'])
        AbstractSync.clearCache()
        user = await Kopnik.create({
            status: Kopnik.Status.NEW,
        }, 'user')
        await user.login()
        application = container.application
        await application.authenticate()
        kopa= new Kopa()
    })

    it('render', async () => {
        const kopnik2 = Kopnik.getReference(2)
        kopnik2.isLoaded=true
        kopa.add(kopnik2)
        const wrapper= mount(KopaInviteVue, {
            ...vuePlugins,
            propsData: {
                value: kopa
            }
        })
        await flushPromises()
    })
})
