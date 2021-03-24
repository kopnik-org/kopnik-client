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

describe('components KProfile disabled', () => {
  /** @type {Kopnik} */  let user,
    /** @type {Application} */  application,
    /** @type {Wrapper} */ appWrapper,
    /** @type {Wrapper} */ wrapper

  beforeEach(async () => {
    bottle.resetProviders(['application', 'cookieService'])
    AbstractSync.clearCache()
    user = await Kopnik.create({
      status: Kopnik.Status.NEW,
      isLoaded: true,
    }, 'user')
    fetch.resetMocks()
    fetch.mockIfEx(/Allowed/, true)
    application = container.application
    application.section = Application.Section.Profile
    application.user = user
  })

  it('disabled by empty changeset', async () => {
    appWrapper = mount(KApp, {
      ...vuePlugins,
    })
    wrapper = appWrapper.findComponent({ref: 'section'})

    await waitForExpect(() => {
      expect(wrapper.findComponent({ref: 'confirm'}).attributes('disabled')).toBe('disabled')
    })
  })

  it('disabled by fio', async () => {
    user.patronymic = ''
    // wrapper.findComponent({ref:'request'}).findComponent({ref:'firstName'}).get('input').setValue('')
    appWrapper = mount(KApp, {
      ...vuePlugins,
    })
    wrapper = appWrapper.findComponent({ref: 'section'})

    // меняем одно поле
    await flushPromises()
    wrapper.vm.$data.request.firstName='changed'

    await waitForExpect(() => {
      expect(wrapper.findComponent({ref: 'confirm'}).attributes('disabled')).toBe('disabled')
    })
  })

  it('disabled by messages not allowed', async () => {
    fetch.mockIfEx(/Allowed/, false)

    appWrapper = mount(KApp, {
      ...vuePlugins,
    })
    wrapper = appWrapper.findComponent({ref: 'section'})

    // меняем одно поле
    await flushPromises()
    wrapper.vm.$data.request.firstName='changed'

    await waitForExpect(() => {
      expect(wrapper.findComponent({ref: 'confirm'}).attributes('disabled')).toBe('disabled')
    })
  })
})
