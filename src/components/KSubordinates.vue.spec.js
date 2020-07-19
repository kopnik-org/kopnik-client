import flushPromises from "flush-promises";

import {AbstractSync, Kopnik} from "../models";
import vuePlugins from "../../tests/test-setup";
import {container} from "../bottle/bottle";
import {mount} from "@vue/test-utils";
import waitForExpect from "wait-for-expect";
import KSubordinates from "./KSubordinates";
import KopnikVue from "./KopnikVue";

// real fetch
container.constants.di.fetch = true

describe('components KSubordinates', () => {
    /** @type {Kopnik} */
    let foreman

    beforeEach(async () => {
        AbstractSync.clearCache()
    })

    it('draw', async () => {
        // старшина
        foreman = await Kopnik.create({}, 'foreman')
        foreman.isLoaded = false
        await foreman.login()

        // подчиненный
        await Kopnik.create({
            foreman_id: foreman.id,
        }, 'subordinate')

        // подал заявку
        await Kopnik.create({
            foremanRequest_id: foreman.id,
        }, 'requester')

        let wrapper = mount(KSubordinates, {
            ...vuePlugins,
            propsData: {
                value: foreman,
            }
        })

        await waitForExpect(() => {
            expect(foreman.subordinates).toHaveLength(1)
            expect(foreman.foremanRequests).toHaveLength(1)
        })

        wrapper = mount(KSubordinates, {
            ...vuePlugins,
            propsData: {
                value: foreman,
            }
        })
        await flushPromises()
        expect(wrapper.findAll({ref: 'subordinates'}).wrappers).toHaveLength(1)
        expect(wrapper.findAll({ref: 'foremanRequests'}).wrappers).toHaveLength(1)
    })
})


