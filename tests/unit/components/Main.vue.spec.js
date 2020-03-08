import flushPromises from "flush-promises";
import { mount } from '@vue/test-utils'

import vuePlugins from "../../test-setup";
import {container} from "../../../src/bottle/bottle";
import MainVue from "../../../src/components/MainVue";

describe('unit components Witness', () => {
    beforeAll(async () => {
    })

    beforeEach(() => {
    })

    it('draw', async () => {
        await login(5)
        await container.application.authenticate()
        const wrapper = mount(MainVue, {
            ...vuePlugins,
            propsData:{
            }
        })
        await flushPromises()
        expect(wrapper.vm.lmap).not.toBeUndefined()
    })
})

