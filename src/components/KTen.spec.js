import flushPromises from "flush-promises";

import {AbstractSync, Kopnik} from "../models";
import vuePlugins from "../../tests/test-setup";
import {bottle, container} from "../bottle/bottle";
import {mount} from "@vue/test-utils";
import KApp from "@/components/KApp/KApp";
import Application from "@/application/Application";
import messages from "@/locales";

// real fetch
container.constants.di.fetch = true

describe('components KTen', () => {
  let /** @type {Application} */ application,
    /** @typeof {Application.sections.main} */ ten,
    /** @type {Kopnik} */ user,
    /** @type {Kopnik} */ foreman,
    /** @type {Kopnik} */ subordinate,
    /** @type {Kopnik} */ requester,
    /** @type {Wrapper} */ appWrapper,
    /** @type {Wrapper} */ wrapper

  beforeEach(async () => {
    bottle.resetProviders(['application', 'cookieService'])
    AbstractSync.clearCache()

    foreman = await Kopnik.create({
        status: Kopnik.Status.CONFIRMED,
        isLoaded: true,
      },
      'foreman'
    )
    user = await Kopnik.create({
        status: Kopnik.Status.CONFIRMED,
        isLoaded: true,
        foreman_id: foreman.id,
      },
      'user'
    )
    subordinate = await Kopnik.create({
        status: Kopnik.Status.CONFIRMED,
        isLoaded: true,
      },
      'subordinate'
    )
    requester = await Kopnik.create({
        status: Kopnik.Status.CONFIRMED,
        isLoaded: true,
      },
      'requester'
    )
    application = container.application
    application.section = Application.Section.Ten
    application.user = user

    fetch.resetMocks()
    fetch.mockIfEx(/get.ids=/, async (req) => {
      const id = Number.parseInt(req.url.match(/(-?\d+)$/)[1])
      const kopnik = await Kopnik.get(id)
      return [kopnik.plain]
    })
    fetch.mockIfEx(/getSubordinates/, [subordinate.plain])
    fetch.mockIfEx(/getForemanRequests/, [requester.plain])

    const div = document.createElement('div')
    if (document.body) {
      document.body.appendChild(div)
    }

    appWrapper = mount(KApp, {
      ...vuePlugins,
      attachTo: div,
    })

    await flushPromises()
    wrapper = appWrapper.findComponent({ref: 'section'})
  })
  afterEach(() => {
    appWrapper.destroy()
  })


  it('draw', async () => {
    // страница
    expect(wrapper.vm).not.toBeUndefined()

    // старшина
    expect(wrapper.findComponent({ref: 'foreman'}).vm.$props.value).toBe(foreman)

    // пользователь
    expect(wrapper.findComponent({ref: 'user'}).vm.$props.value).toBe(user)

    // подчиненный
    expect(wrapper.findAllComponents({ref: 'subordinate'}).wrappers[0].vm.$props.value).toBe(subordinate)

    // заявки в десятку
    expect(wrapper.findAllComponents({ref: 'foremanRequest'}).wrappers[0].vm.$props.value).toBe(requester)
  })

  it('reset foreman', async () => {
    // нажимаю на крестик
    wrapper.findComponent({ref: 'resetForemanAsk'}).trigger('click')
    await flushPromises()

    // проверяю что открылся диалог снять старшину
    expect(wrapper.vm.$refs.resetForemanDialog.$data.isActive).toBeTruthy()
    expect(appWrapper.html()).toContain(messages.ru.details.resetForemanQuestion)

    // нажимаю подтвердить
    fetch.mockIfEx(/resetForeman/, 'OK')
    wrapper.findComponent({ref: 'resetForemanConfirm'}).trigger('click')
    await flushPromises()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(user.foreman).toBeNull()
    expect(appWrapper.html()).toContain(messages.ru.details.resetForemanInfo)
    expect(wrapper.vm.$refs.resetForemanDialog.$data.isActive).toBeFalsy()
  })

  it('remove from subordinates', async () => {
    // нажимаю на крестик
    wrapper.findComponent({ref: 'removeFromSubordinatesAsk'}).trigger('click')
    await flushPromises()

    // проверяю что открылся диалог исключить из подчиненных
    expect(wrapper.vm.$refs.removeFromSubordinatesDialog.$data.isActive).toBeTruthy()
    expect(appWrapper.html()).toContain(messages.ru.subordinates.removeFromSubordinatesQuestion)

    // нажимаю подтвердить
    fetch.mockIfEx(/resetForeman/, 'OK')
    wrapper.findComponent({ref: 'removeFromSubordinatesConfirm'}).trigger('click')
    await flushPromises()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(user.subordinates.length).toBe(0)
    expect(appWrapper.html()).toContain(messages.ru.subordinates.removeFromSubordinatesInfo)
    expect(wrapper.vm.$refs.removeFromSubordinatesDialog.$data.isActive).toBeFalsy()
  })

  it('confirm foreman request', async () => {
    // нажимаю на ПРИНяТЬ
    fetch.mockIfEx(/confirmForemanRequest/, 'OK')
    wrapper.findAllComponents({ref: 'confirmForemanRequest'}).wrappers[0].trigger('click')
    await flushPromises()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(user.subordinates[1]).toBe(requester)
    expect(appWrapper.html()).toContain(messages.ru.subordinates.confirmForemanRequestInfo)
    expect(wrapper.vm.$refs.foremanRequest).toHaveLength(0)
  })

  it('decline foreman request', async () => {
    // нажимаю на ПРИНяТЬ
    fetch.mockIfEx(/declineForemanRequest/, 'OK')
    wrapper.findAllComponents({ref: 'declineForemanRequest'}).wrappers[0].trigger('click')
    await flushPromises()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(user.subordinates).toHaveLength(1)
    expect(appWrapper.html()).toContain(messages.ru.subordinates.declineForemanRequestInfo)
    expect(wrapper.vm.$refs.foremanRequest).toHaveLength(0)
  })
})


