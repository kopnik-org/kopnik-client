import flushPromises from "flush-promises";
import Vue from 'vue'
import { mount } from '@vue/test-utils'

import vuePlugins from "../../tests/test-setup";
import {container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import WitnessVue from "./WitnessVue";
import KSubordinates from "./KTen";
import waitForExpect from "wait-for-expect";


// real fetch
container.constants.di.fetch = true

describe('components Witness', () => {
    /** @type {Kopnik} */
    let witness

    beforeEach(async () => {
        AbstractSync.clearCache()
    })

    it('draw', async () => {
        // старшина
        witness = await Kopnik.create({}, 'witness')
        await witness.login()

        // подчиненный
        await Kopnik.create({
            foreman_id: witness.id,
        }, 'subordinate')

        // подал заявку
        await Kopnik.create({
            foremanRequest_id: witness.id,
        }, 'requester')

        let wrapper = mount(KSubordinates, {
            ...vuePlugins,
            propsData: {
                value: witness,
            }
        })

        await waitForExpect(() => {
            expect(witness.subordinates).toHaveLength(1)
            expect(witness.foremanRequests).toHaveLength(1)
        })

        wrapper = mount(KSubordinates, {
            ...vuePlugins,
            propsData: {
                value: witness,
            }
        })
        await flushPromises()
        expect(wrapper.findAll({ref: 'subordinates'}).wrappers).toHaveLength(1)
        expect(wrapper.findAll({ref: 'foremanRequests'}).wrappers).toHaveLength(1)
    })
})

