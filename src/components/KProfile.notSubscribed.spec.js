import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins from "../../tests/test-setup";
import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import ProfileVue from "./KProfile";
import Application from "../application/Application";
import KopnikVue from "./KopnikVue";
import Vue from 'vue'
import waitForExpect from "wait-for-expect";
import KApp from "@/components/KApp/KApp";

// real fetch
container.constants.di.fetch = true

describe('components KProfile alert:not subscribed', () => {
  /** @type {Kopnik} */  let user,
    /** @type {Application} */  application,
    /** @type {Wrapper} */ appWrapper,
    /** @type {Wrapper} */ wrapper

  beforeEach(async () => {
    bottle.resetProviders(['application', 'cookieService'])
    AbstractSync.clearCache()
    user = await Kopnik.create({
      status: Kopnik.Status.PENDING,
      isLoaded: true,
    }, 'user')
    fetch.resetMocks()
    application = container.application
    application.section = Application.Section.Profile
    application.user = user
  })

  it('show when not subscribed', async () => {
    fetch.mockIfEx(/Allowed/, false)

    appWrapper = mount(KApp, {
      ...vuePlugins,
    })
    await flushPromises()
    wrapper = appWrapper.findComponent({ref: 'section'})

    expect(wrapper.findComponent({ref: 'alert'}).html()).toContain(application.getMessage('profile.alert[4]'))
  })
  it('hide on subscribe', async () => {
    fetch.mockIfEx(/Allowed/, true)

    appWrapper = mount(KApp, {
      ...vuePlugins,
    })
    await flushPromises()
    wrapper = appWrapper.findComponent({ref: 'section'})

    expect(wrapper.findComponent({ref: 'alert'}).html()).not.toContain(application.getMessage('profile.alert[4]'))
  })
})
