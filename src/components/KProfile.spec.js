import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../tests/test-setup";
import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import ProfileVue from "./KProfile";
import Application from "../application/Application";
import KopnikVue from "./KopnikVue";
import waitForExpect from "wait-for-expect";
import KApp from "@/components/KApp/KApp";
import messages from "@/locales";

// real fetch
container.constants.di.fetch = true

describe('components KProfile', () => {
  /** @type {Kopnik} */  let user,
    /** @type {Application} */  application,
    /** @type {Wrapper} */ appWrapper,
    /** @type {Wrapper} */ wrapper

  beforeEach(async () => {
    bottle.resetProviders(['application', 'cookieService'])
    AbstractSync.clearCache()
    user = await Kopnik.create({
      status: Kopnik.Status.NEW,
      role: Kopnik.Role.Kopnik,
      birthYear: 1983,
      isLoaded: true,
    }, 'user')
    fetch.resetMocks()
    fetch.mockIfEx(/Allowed/, true)
    fetch.mockIfEx(/getTop/, [])
    fetch.mockIfEx(/get\?ids/, [{}])
    application = container.application
    application.user = user

    appWrapper = mount(KApp, {
      ...vuePlugins,
      router: routerFactory(),
      stubs: {
        MapVue: {template: '<div></div>'}
      }
    })
    await flushPromises()
    application.section = Application.Section.Profile
    await flushPromises()
    await flushPromises()
    await flushPromises()
    await flushPromises()
    wrapper = appWrapper.findComponent({ref: 'section'})
  })

  it('draw new', async () => {
    expect(wrapper.vm.$refs.request.$props.value).toEqual(user)
    // expect(wrapper.findComponent({ref: 'confirm'}).attributes('disabled')).toBe('disabled')
    // expect(wrapper.findComponent({ref: 'confirm'}).vm.$props.disabled).toBeTruthy()

    // wrapper.findComponent({ref: 'request'}).findComponent({ref: 'birthYear'}).get('input').setValue('1983')
    // wrapper.findComponent({ref: 'request'}).findComponent({ref: 'role'}).get('input').setChecked(true)
    // application.user.birthYear=1983
    // application.user.role=Kopnik.Role.Kopnik
    expect(wrapper.findComponent({ref: 'confirm'}).vm.$props.disabled).toBeFalsy()
  })

  it('submit', async () => {
    wrapper.findComponent({ref: 'request'}).findComponent({ref: 'firstName'}).get('input').setValue('1234')
    fetch.mockIfEx(/updateProfile/, 'OK')
    wrapper.findComponent({ref: 'confirm'}).trigger('click')
    await flushPromises()
    await flushPromises()
    expect(user.status).toBe(Kopnik.Status.PENDING)
    expect(user.firstName).toBe('1234')
    expect(application.section).toBe(Application.Section.Main)
    expect(appWrapper.html()).toContain(messages.ru.profile.submitMessage)
  })

  it('locale', async () => {
    const kopnikWrapper = wrapper.findComponent(KopnikVue)
    const en = container.localeManager.getLocaleByShortName('en')


    fetch.mockIfEx(/updateLocale/, 'OK')
    /* ???
    kopnikWrapper.findComponent({ref:'locale'}).get('input[type=hidden]').setValue({name:'en', languageName: 'English'})
    kopnikWrapper.findComponent({ref:'locale'}).get('input[type=hidden]').setValue('English')
    kopnikWrapper.findComponent({ref:'locale'}).get('input[type=hidden]').setValue({value:'en', text: 'English'})
    */
    await kopnikWrapper.vm.locale_change(en)
    await flushPromises()
    // KProfile работает с копией Пользователя и в компонент KopnikVue передает тоже копию
    // Реальный Копник получит обновление локали только после того, как изменится локаль на сервере
    expect(container.application.user.locale).toBe(en)
    expect(container.localeManager.currentLocale).toBe(en)
  })
})
