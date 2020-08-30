import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../tests/test-setup";
import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import MainVue from "./MainVue";
import waitForExpect from "wait-for-expect";
import MapVue from "@/components/MapVue";
import api from "@/api";
import {LatLng, LatLngBounds} from "leaflet";


describe('components KMain', () => {
  let application, main, user, wrapper

  beforeEach(async () => {
    bottle.resetProviders(['application', 'cookieService'])
    AbstractSync.clearCache()
    user = await Kopnik.create({
        status: Kopnik.Status.NEW,
        isLoaded: true,
      },
      'user'
    )
    application = container.application
    main = application.sections.main

    fetch.resetMocks()
    fetch.mockIfEx(/ids=$/, [user.plain])
    fetch.mockIfEx(/getTopInsideSquare/, [user.plain])
    application.user = user


    await application.authenticate()
    wrapper = mount(MainVue, {
      ...vuePlugins,
      propsData: {}
    })
    await flushPromises()
  })

  it('draw', async () => {
    // const a = await api('users/getTopInsideSquare?x1=-180&y1=-40&x2=180&y2=40&count=10&maxRank=300000000')

    main.map.bounds = new LatLngBounds(new LatLng(1, 1), new LatLng(2, 2))
    // const b = await main.loadTop20()
    //
    // console.log(a,b)
    //
    expect(wrapper.vm.lmap).not.toBeUndefined()

    await waitForExpect(() => {
      // загрузилась 10ка самых ранговых
      expect(main.top20.length).toBeTruthy()
    })

    // await new Promise(res=>setInterval(res, 4500))
  },1000)
})

