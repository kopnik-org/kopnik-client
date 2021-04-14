import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../../tests/test-setup";
import AppVue from "./KApp";
import {bottle, container} from "@/bottle/bottle";
import main from "@/locales/ru/main.json";
import fetchMock from "jest-fetch-mock";
import {Kopnik} from "@/models";

// real fetch
container.constants.di.fetch = true

describe('components KApp needUpdate', () => {
  let wrapper,
    application

  beforeEach(() => {
    bottle.resetProviders(['application', 'cookieService'])
    application = container.application
    // application.user = null

  })

  it('draw', async () => {
    fetchMock.mockIf(/.*/, async (req) => {
      const user = await Kopnik.create({isLoaded: true})
      return {
        body: JSON.stringify({
          version: '777.0.0',
          response: [user.plain]
        })
      }
    })

    wrapper = mount(AppVue, {
      ...vuePlugins,
    })
    await flushPromises()
    expect(wrapper.text()).toContain(main.alert.needUpdate)

  })
})
