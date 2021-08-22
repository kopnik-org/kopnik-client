import flushPromises from "flush-promises";
import Vue from 'vue'
import {mount} from '@vue/test-utils'
import waitForExpect from "wait-for-expect";

import vuePlugins, {routerFactory} from "../../../tests/test-setup";
import AppVue from "./KApp";
import {bottle, container} from "../../bottle/bottle";
import Application from "../../application/Application";
import {NavigationFailureType} from "vue-router";

// real fetch
container.constants.di.fetch = true

describe('components KApp anonymous', () => {
  let wrapper,
    application

  beforeEach(() => {
    bottle.resetProviders(['application', 'cookieService'])
    application = container.application
    application.user = null
    wrapper = mount(AppVue, {
      ...vuePlugins,
      router: routerFactory(),
    })
  })

  it('render', async () => {
    await waitForExpect(() => {
      expect(application.user).toBeNull()
      expect(wrapper.text()).toContain('Войти')
    })
  })

  describe('enter', () => {
    it('/', async () => {
      await waitForExpect(() => {
        expect(application.user).toBeNull()
        expect(wrapper.text()).toContain('Войти')
        expect(application.section).toBe(Application.Section.About)
      })
    })
    it('/profile', async () => {
      try {
        await wrapper.vm.$router.push({name: Application.Section.Profile})
        throw new Error('should not be hire')
      } catch (err) {
        expect(err.type).toBe(NavigationFailureType.redirected)
      }
      expect(application.section).toBe(Application.Section.About)
      expect(wrapper.vm.$router.currentRoute.name).toBe(Application.Section.About)
      await flushPromises()
      expect(wrapper.text()).toContain('Войти')
    })
    it('/witness', async () => {
      try {
        await wrapper.vm.$router.push({name: Application.Section.Witness})
        throw new Error('should not be hire')
      } catch (err) {
        expect(err.type).toBe(NavigationFailureType.redirected)
      }
      expect(application.section).toBe(Application.Section.About)
      expect(wrapper.vm.$router.currentRoute.name).toBe(Application.Section.About)
      await flushPromises()
      expect(wrapper.text()).toContain('Войти')
    })
  })
})
