import flushPromises from "flush-promises";
import {mount} from '@vue/test-utils'

import vuePlugins, {routerFactory} from "../../tests/test-setup";
import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import MainVue from "./KMain";
import messages from "@/locales";
import waitForExpect from "wait-for-expect";
import KApp from "@/components/KApp/KApp";
import Vue from "vue"
import Application from "@/application/Application";
import  "@/register-error-handlers";


describe('components KMain confirmed details', () => {
  let /** @type {Application} */ application,
    /** @typeof {Application.sections.main} */ main,
    /** @type {Kopnik} */ user,
    /** @type {Kopnik} */ other,
    /** @type {Wrapper} */ appWrapper,
    /** @type {Wrapper} */ wrapper

  beforeEach(async () => {
    bottle.resetProviders(['application', 'cookieService'])
    AbstractSync.clearCache()
    user = await Kopnik.create({
        isLoaded: true,
      },
      'user'
    )
    other = await Kopnik.create({
        isLoaded: true,
      },
      'other'
    )
    application = container.application
    application.user = user
    application.section= Application.Section.Main
    main = application.sections.main

    fetch.resetMocks()
    fetch.mockIfEx(/ids=$/, [user.plain])
    fetch.mockIfEx(/getTopInsideSquare/, [user.plain, other.plain])

    const div = document.createElement('div')
    if (document.body) {
      document.body.innerHTML = "";
      document.body.appendChild(div)
    }

    appWrapper = mount(KApp, {
      ...vuePlugins,
      attachTo: div,
      stubs: {
        KDrawer: {template: '<div></div>'}
      }
    })

    await flushPromises()
    wrapper = appWrapper.findComponent({ref: 'section'})
  })
  afterEach(()=>{
    appWrapper.destroy()
  })

  /**
   * this test should be first to work (TODO: investigate it)
   */
  it('too ranked foreman', async () => {
    other.rank= 100
    main.selected = other
    await flushPromises()

    // await waitForExpect(async () => { s
    // нажимаю на кнопку "на копу", которая помещает копника в список участников
    await wrapper.findComponent({ref: 'toggleParticipant'}).trigger('click')
    await flushPromises()
    // нажимаю на кнопку "Созвать всех"
    await wrapper.findComponent({ref: 'kopaAsk'}).trigger('click')
    await flushPromises()

    //теперь ввожу тему и проверяю что кнопка стала активна
    main.kopa.subject='1234'
    await flushPromises()

    // нажимаю подтвердить
    wrapper.findComponent({ref: 'kopaDialogOK'}).trigger('click')
    await flushPromises()
    await Vue.nextTick()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(appWrapper.html()).toContain(appWrapper.vm.$t('kopaDialog.tooRankedForemanError', {foremanName: other.name}))
    expect(wrapper.vm.$refs.kopaDialog).not.toBeUndefined()
  })

  it('invite kopa', async () => {
    user.foreman= other
    other.rank=100
    main.selected = other
    await flushPromises()

    // await waitForExpect(async () => { s
    // нажимаю на кнопку "на копу", которая помещает копника в список участников
    await wrapper.findComponent({ref: 'toggleParticipant'}).trigger('click')
    await flushPromises()
    // нажимаю на кнопку "Созвать всех"
    await wrapper.findComponent({ref: 'kopaAsk'}).trigger('click')
    await flushPromises()

    // проверяю что открылся диалог копы
    expect(wrapper.vm.$refs.kopaDialog.$data.isActive).toBeTruthy()
    expect(appWrapper.html()).toContain(messages.ru.kopaDialog.title)

    // проверяю что без темы не активна кнопка
    expect(wrapper.findComponent({ref: 'kopaDialogOK'}).vm.$props.disabled).toBeTruthy()

    //теперь ввожу тему и проверяю что кнопка стала активна
    main.kopa.subject='1234'
    await flushPromises()
    expect(wrapper.findComponent({ref: 'kopaDialogOK'}).vm.$props.disabled).toBeFalsy()

    // нажимаю подтвердить
    fetch.mockIfEx(/inviteKopa/, 'OK')
    wrapper.findComponent({ref: 'kopaDialogOK'}).trigger('click')
    await flushPromises()
    await Vue.nextTick()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(wrapper.vm.$refs.kopaDialog).toBeUndefined()
    expect(appWrapper.html()).toContain(messages.ru.kopaDialog.afterInfo)
  })

  it('show on select', async () => {
    main.selected = other
    await flushPromises()

    expect(wrapper.vm.$refs.details.$data.isActive).toBeTruthy()
  })

  it('put foreman request', async () => {
    main.selected = other
    await flushPromises()
    expect(wrapper.vm.$refs.details.$data.isActive).toBeTruthy()

    // нажимаю на правую нижнюю кнопку
    wrapper.findComponent({ref: 'foremanAsk'}).trigger('click')
    await flushPromises()

    // проверяю что открылся диалог старшины
    expect(wrapper.vm.$refs.foremanDialog.$data.isActive).toBeTruthy()
    expect(appWrapper.html()).toContain(messages.ru.details.toForemanQuestion)

    // нажимаю подтвердить
    fetch.mockIfEx(/putForemanRequest/, 'OK')
    wrapper.findComponent({ref: 'foremanConfirm'}).trigger('click')
    await flushPromises()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(user.foremanRequest).toBe(other)

    expect(appWrapper.html()).toContain(messages.ru.details.toForemanInfo)

    expect(wrapper.vm.$refs.foremanDialog.$data.isActive).toBeFalsy()
  })

  it('reset foreman request', async () => {
    user.foremanRequest = main.selected = other
    await flushPromises()

    await waitForExpect(async () => {
      // нажимаю на правую нижнюю кнопку
      wrapper.findComponent({ref: 'foremanAsk'}).trigger('click')
      await flushPromises()

      // проверяю что открылся диалог старшины
      expect(wrapper.vm.$refs.foremanDialog.$data.isActive).toBeTruthy()
      expect(appWrapper.html()).toContain(messages.ru.details.cancelForemanRequestQuestion)
    })

    // нажимаю подтвердить
    fetch.mockIfEx(/putForemanRequest/, 'OK')
    await wrapper.findComponent({ref: 'foremanConfirm'}).trigger('click')
    await flushPromises()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(user.foremanRequest).toBeNull()

    expect(appWrapper.html()).toContain(messages.ru.details.cancelForemanRequestInfo)

    expect(wrapper.vm.$refs.foremanDialog.$data.isActive).toBeFalsy()
  })

  it('reset foreman', async () => {
    user.foreman = main.selected = other
    await flushPromises()

    // await waitForExpect(async () => { s
    // нажимаю на правую нижнюю кнопку
    await wrapper.findComponent({ref: 'foremanAsk'}).trigger('click')
    await flushPromises()

    // проверяю что открылся диалог старшины
    expect(wrapper.vm.$refs.foremanDialog.$data.isActive).toBeTruthy()
    expect(appWrapper.html()).toContain(messages.ru.details.resetForemanQuestion)

    // нажимаю подтвердить
    fetch.mockIfEx(/resetForeman/, 'OK')
    wrapper.findComponent({ref: 'foremanConfirm'}).trigger('click')
    await flushPromises()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(user.foreman).toBeNull()

    expect(appWrapper.html()).toContain(messages.ru.details.resetForemanInfo)

    expect(wrapper.vm.$refs.foremanDialog.$data.isActive).toBeFalsy()
  })

})

