import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../../tests/test-setup";
import {bottle, container} from "@/bottle/bottle";
import main from "@/locales/ru/main.json";
import fetchMock from "jest-fetch-mock";
import {Kopnik} from "@/models";
import {KopnikApiError} from "@/KopnikError";
import KAlert from "@/components/KAlert/KAlert";
import KApp from "@/components/KApp/KApp";

// real fetch
container.constants.di.fetch = true

describe('components KAlert failedToFetch', () => {
  let wrapper,
    application

  beforeEach(() => {
    bottle.resetProviders(['application', 'cookieService'])
    application = container.application
    // application.user = null

  })

  it('draw', async () => {
    wrapper = mount(KAlert, {
      ...vuePlugins,
    })

    fetchMock.mockReject(new Error('Failed to fetch for test'))
    try {
      await container.api('1234')
    }
    catch(err){
      expect(err.preventDefault).toBeTruthy()
    }

    await flushPromises()
    expect(wrapper.findComponent({ref:'failedToFetch'}).vm.$props.value).toBeTruthy()
    expect(wrapper.text()).toContain(main.alert.failedToFetch)
  })
})
