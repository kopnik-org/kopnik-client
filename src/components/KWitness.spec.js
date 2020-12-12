import flushPromises from "flush-promises";
import Vue from 'vue'
import {mount} from '@vue/test-utils'

import vuePlugins from "../../tests/test-setup";
import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import WitnessVue from "./KWitness";
import KSubordinates from "./KTen";
import waitForExpect from "wait-for-expect";
import Application from "@/application/Application";
import KApp from "@/components/KApp/KApp";
import messages from "@/locales";

describe('components Witness', () => {
  let /** @type {Application} */ application,
    /** @typeof {Application.sections.main} */ ten,
    /** @type {Kopnik} */ user,
    /** @type {Kopnik} */ request,
    /** @type {Wrapper} */ appWrapper,
    /** @type {Wrapper} */ wrapper

  beforeEach(async () => {
    bottle.resetProviders(['application', 'cookieService'])
    AbstractSync.clearCache()

    user = await Kopnik.create({
        status: Kopnik.Status.CONFIRMED,
        isLoaded: true,
      },
      'user'
    )
    request = await Kopnik.create({
        status: Kopnik.Status.CONFIRMED,
        isLoaded: true,
        witness_id: user.id,
      },
      'subordinate'
    )
    application = container.application
    application.section = Application.Section.Witness
    application.user = user

    fetch.resetMocks()
    fetch.mockIfEx(/getWitnessRequests$/, [request.plain])

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


  it('reload on create', async () => {
    expect(user.witnessRequests).toHaveLength(1)
    expect(user.witnessRequests[0]).toBe(request)
  })

  it('draw', async () => {
    expect(wrapper.findAllComponents({ref: 'witnessRequest'}).wrappers).toHaveLength(1)
    expect(wrapper.findAllComponents({ref: 'witnessRequest'}).wrappers[0].vm.$props.value).toBe(request)
  })

  it('confirm request', async () => {
    const update= jest.fn()
    // нажимаю на ПРИНяТЬ
    fetch.mockIfEx(/updateWitnessRequest/, update)
    wrapper.findAllComponents({ref: 'confirm'}).wrappers[0].trigger('click')
    await flushPromises()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(user.witnessRequests).toHaveLength(0)
    expect(JSON.parse(update.mock.calls[0][0].body)).toHaveProperty('status',2)
    // expect(appWrapper.html()).toContain(messages.ru.subordinates.confirmForemanRequestInfo)
  })

  it('decline request', async () => {
    const update= jest.fn()
    // нажимаю на ОТКЛОНИТЬ
    fetch.mockIfEx(/updateWitnessRequest/, update)
    wrapper.findAllComponents({ref: 'decline'}).wrappers[0].trigger('click')
    await flushPromises()

    // проверяю что заявка обработалась, сообщение отобразилось и диалог скрылся
    expect(user.witnessRequests).toHaveLength(0)
    expect(JSON.parse(update.mock.calls[0][0].body)).toHaveProperty('status',3)
    // expect(appWrapper.html()).toContain(messages.ru.subordinates.confirmForemanRequestInfo)
  })
})

