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
import fetchMock from "jest-fetch-mock";

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
      isLoaded: true,
    }, 'user')
    fetch.resetMocks()
    fetch.mockIfEx(/Allowed/, true)
    fetch.mockIfEx(/getTop/, [])
    application = container.application
    application.user = user

    const div = document.createElement('div')
    if (document.body) {
      document.body.appendChild(div)
    }

    appWrapper = mount(KApp, {
      ...vuePlugins,
      router: routerFactory(),
      stubs: {
        MapVue: {template: '<div></div>'}
      },
      attachTo: div,
    })
    await flushPromises()
    application.section = Application.Section.Profile
    await flushPromises()

    wrapper = appWrapper.findComponent({ref: 'section'})

    // меняем одно поле
    // await flushPromises()
    // wrapper.vm.$data.request.firstName = 'changed'
    // await flushPromises()
    fetchMock.mockClear()
  })

  afterEach(()=>{
    appWrapper.destroy()
  })

  it('draw', async () => {
    expect(wrapper.vm.$refs.request.$props.value.plain).toEqual({...user.plain,})
    // expect(wrapper.findComponent({ref: 'confirm'}).attributes('disabled')).toBeFalsy()
  })

  it('submit', async () => {
    wrapper.findComponent({ref: 'request'}).findComponent({ref: 'firstName'}).get('input').setValue('1234')
    await flushPromises()


    // нажимаю на кнопку
    await wrapper.findComponent({ref: 'confirm'}).trigger('click')
    await flushPromises()

    // проверяю что открылся диалог
    expect(wrapper.vm.$refs.submitDialog.$data.isActive).toBeTruthy()
    expect(appWrapper.html()).toContain(messages.ru.profile.submitDialog.title)

    // нажимаю подтвердить
    fetch.mockIfEx(/updateProfile/, 'OK')
    wrapper.findComponent({ref: 'submitYes'}).trigger('click')
    await flushPromises()


    // проверяю что диалоги закрылся
    expect(wrapper.vm.$refs.submitDialog).toBeFalsy()

    // проверяю что высветилось сообщение
    expect(appWrapper.html()).toContain(messages.ru.profile.submitMessage)

    // проверяю модель
    expect(user.status).toBe(Kopnik.Status.PENDING)
    expect(user.firstName).toBe('1234')

    // проверяю что перешел на другую секцию
    expect(application.section).toBe(Application.Section.Main)

    // даю время роутеру асинхронно отработать
    await flushPromises()

    // const a = fetchMock.mock.calls[0][1]
    // const a = fetchMock.mock
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
    // KProfile работает с копией Пользователя (чё???) и
    // в компонент KopnikVue передает тоже копию
    // Реальный Копник получит обновление локали только после того, как изменится локаль на сервере
    expect(container.application.user.locale).toBe(en)
    expect(container.localeManager.currentLocale).toBe(en)
  })
})
