import flushPromises from "flush-promises";

import vuePlugins from "../../tests/test-setup";
import ThanksVue from "./KThanks";
import {bottle, container} from "../bottle/bottle";
import {mount} from "@vue/test-utils";
import KopnikVue from "./KopnikVue";

// real fetch
container.constants.di.fetch = true

describe('unit components Thanks', () => {
    beforeEach(() => {
        // удаляем, потому что ThanksVue пообует авторизоваться перед отрисовкой
        bottle.resetProviders(['application', 'cookieService'])
    })

    it('offline', async () => {
        const wrapper = mount(ThanksVue, {
            ...vuePlugins,
        })
        await flushPromises()
        expect(wrapper.findAllComponents(KopnikVue).wrappers.length).toBeGreaterThan(5)
    })
})

