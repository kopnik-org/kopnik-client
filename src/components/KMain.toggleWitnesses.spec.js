import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../tests/test-setup";
import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import MainVue from "./KMain";
import waitForExpect from "wait-for-expect";
import {LatLng, LatLngBounds} from "leaflet";


describe('components KMain toggleWitnesses', () => {
  let application, main, witness, wrapper

  beforeEach(async () => {
    bottle.resetProviders(['application', 'cookieService'])
    AbstractSync.clearCache()
    witness = await Kopnik.create({
        isWitness: true,
        isLoaded: true,
      },
      'witness'
    )
    application = container.application
    main = application.sections.main

    fetch.resetMocks()
    fetch.mockIfEx(/ids=$/, [witness.plain])
    fetch.mockIfEx(/getTopInsideSquare/, [])
    fetch.mockIfEx(/getWitnessesInsideSquare/, [witness.plain])
    // a??? чтобы авторизоваться
    container.VK.Auth.session = true

    await application.authenticate()
    wrapper = mount(MainVue, {
      ...vuePlugins,
      propsData: {}
    })
    await flushPromises()
  })

  it('do', async () => {
    main.map.bounds = new LatLngBounds(new LatLng(-90, -180), new LatLng(90, 180))

    await wrapper.findComponent({ref: 'toggleWitnesses'}).trigger('click')
    await flushPromises()
    expect(main.witnesses.length).toBeTruthy()
    expect(wrapper.vm.$refs.witnesses).toHaveLength(1)
  })
})

