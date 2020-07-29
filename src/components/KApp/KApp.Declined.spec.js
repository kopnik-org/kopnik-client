import vuePlugins, {i18n, vuetify, routerFactory} from "../../../tests/test-setup";
import AppVue from "./KApp";
import {bottle, container} from "../../bottle/bottle";
import flushPromises from "flush-promises";
import Application from "../../application/Application";
import {mount} from "@vue/test-utils";
import {Kopnik} from "../../models";


// real fetch
container.constants.di.fetch = true

describe('components AppVue Declined', () => {
    let wrapper,
        application,
        user

    beforeAll(async () => {
        user = await Kopnik.create({
            status: Kopnik.Status.DECLINED
        })
        await user.login()
    })
    beforeEach(async () => {
        bottle.resetProviders(['application'])
        application = container.application
        application.authenticate()
        wrapper = mount(AppVue, {
            ...vuePlugins,
            router: routerFactory(),
        })
    })

    describe('enter', () => {
        it('/', async () => {
            await application.resolveUser()
            await flushPromises()
            expect(application.section).toBe(Application.Section.Main)
            expect(wrapper.vm.$route.name).toBe(Application.Section.Main)
            expect(wrapper.text()).not.toContain('Войти через ВКонтакте')
        })
        it('/profile', async () => {
            await wrapper.vm.$router.push({name: Application.Section.Profile})
            await flushPromises()
            expect(application.section).toBe(Application.Section.Profile)
            expect(wrapper.vm.$route.name).toBe(Application.Section.Profile)
            expect(wrapper.text()).not.toContain('Войти через ВКонтакте')
            expect(wrapper.text()).toContain('Язык')
        })
        it('/witness', async () => {
            try {
                await wrapper.vm.$router.push({name: Application.Section.Witness})
                throw new Error('should not be hire')
            } catch (err) {
                expect(err.type).toBe(1)
            }
            expect(application.section).toBe(Application.Section.Main)
            await flushPromises()
            expect(wrapper.vm.$route.name).toBe(Application.Section.Main)
            expect(wrapper.text()).not.toContain('Войти через ВКонтакте')
        })
    })
})
