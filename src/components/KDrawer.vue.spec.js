import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../tests/test-setup";
import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import DrawerVue from "./KDrawer";
import waitForExpect from "wait-for-expect";

// real fetch
container.constants.di.fetch = true

describe('components Drawer', () => {
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

    it('logout', async () => {
        const wrapper = mount(DrawerVue, {
            ...vuePlugins,
            router: routerFactory()
        })
        await flushPromises()
        // подготовка
        await application.lockSection(async () => {
            await application.setSection(application.constructor.Section.Profile)
        })
        await flushPromises()
        await new Promise(res => setTimeout(res, 1000))
        expect(application.section).toBe(application.constructor.Section.Profile)
        // expect(wrapper.vm.$route.name).toBe(application.constructor.Section.Profile) watcher (application.section) внутри теста не работает

        // тест
        wrapper.find('[logout]').trigger('click')
        await waitForExpect(()=>{
            expect(application.section).toBe(application.constructor.Section.About)
            expect(application.user).toBeNull()
        })
    })

    it('subordinates forbidden', async () => {
        const wrapper = mount(DrawerVue, {
            ...vuePlugins,
            router: routerFactory()
        })

        // тест
        wrapper.find('[subordinates]').trigger('click')
        await waitForExpect(()=>{
            expect(application.section).toBe(application.constructor.Section.Profile)
            expect(application.infos).toHaveLength(1)
        })
    })
})
