import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../../tests/test-setup";
import AppVue from "../KApp/KApp";
import {bottle, container} from "@/bottle/bottle";
import main from "@/locales/ru/main.json";
import fetchMock from "jest-fetch-mock";
import {Kopnik} from "@/models";
import KAlert from "@/components/KAlert/KAlert";

// real fetch
container.constants.di.fetch = true

describe('components KAlert needUpdate', () => {
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

    wrapper = mount(KAlert, {
      ...vuePlugins,
    })
    try{
      await application.resolveUser()
    }
    catch (err){

    }
    await flushPromises()

    expect(wrapper.findComponent({ref:'needUpdate'}).vm.$props.value).toBeTruthy()
    expect(wrapper.text()).toContain(main.alert.needUpdate)

  })
})
