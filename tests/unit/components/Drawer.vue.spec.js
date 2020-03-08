import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../test-setup";
import {bottle, container} from "../../../src/bottle/bottle";
import {Kopnik} from "../../../src/models";
import DrawerVue from "../../../src/components/DrawerVue";

describe('unit components Drawer', () => {
    let application
    beforeAll(async () => {
    })

    beforeEach(() => {
        bottle.resetProviders(['application'])
        application = container.application
    })

    it('logout', async () => {
        await login(2)
        const kopnik = await Kopnik.get(2)
        await application.authenticate()
        const wrapper = mount(DrawerVue, {
            ...vuePlugins,
            router: routerFactory()
        })
        await flushPromises()
        await application.lockSection(async () => {
            await application.setSection(application.constructor.Section.Profile)
        })
        await flushPromises()
        await new Promise(res=>setTimeout(res, 1000))
        expect(application.section).toBe(application.constructor.Section.Profile)
        // expect(wrapper.vm.$route.name).toBe(application.constructor.Section.Profile) watcher (application.section) внутри теста не работает

        wrapper.find('[logout]').trigger('click')
        await flushPromises()
        expect(application.section).toBe(application.constructor.Section.Main)
        expect(application.user).toBeNull()
    })
})
