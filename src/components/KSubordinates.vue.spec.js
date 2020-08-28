import flushPromises from "flush-promises";
import Vue from "vue";

import {AbstractSync, Kopnik} from "../models";
import vuePlugins from "../../tests/test-setup";
import {container} from "../bottle/bottle";
import {mount} from "@vue/test-utils";
import waitForExpect from "wait-for-expect";
import KSubordinates from "./KSubordinates";

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
  it('redraw after reloading subordinates', async () => {
    // старшина
    foreman = await Kopnik.create({}, 'foreman')

    // подчиненный
    const subordinate = await Kopnik.create({
      foreman_id: foreman.id,
    }, 'subordinate')

    foreman.subordinates = [subordinate]
    await foreman.login()
    Vue.observable(foreman)

    let wrapper = mount(KSubordinates, {
      ...vuePlugins,
      propsData: {
        value: foreman,
      }
    })

    await flushPromises()
    expect(wrapper.findAll({ref: 'subordinates'}).wrappers).toHaveLength(1)

    // remove subordinate
    // wrapper.findAll({ref: 'remove'}).wrappers[0].trigger('click')
    // await wrapper.vm.removeFromSubordinates_click(subordinate)
    await foreman.removeFromSubordinates(subordinate)
    await flushPromises()

    // foreman.subordinates=[]
    expect(wrapper.findAll({ref: 'subordinates'}).wrappers).toHaveLength(0)
  })
})


