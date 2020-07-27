import vuePlugins, {i18n, vuetify, routerFactory} from "../../../tests/test-setup";
import AppVue from "./KApp";
import {bottle, container} from "../../bottle/bottle";
import flushPromises from "flush-promises";
import Application from "../../application/Application";
import {mount} from "@vue/test-utils";
import {Kopnik} from "../../models";


// real fetch
container.constants.di.fetch = true

describe('components AppVue Pending', () => {
    let wrapper,
        application,
        user

    beforeAll(async () => {
        user = await Kopnik.create({
            status: Kopnik.Status.PENDING
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
            expect(application.infos).toHaveLength(1)
        })
        it('/profile', async () => {
            // await new Promise(res=>setTimeout(res, 5000))
            try {
                await wrapper.vm.$router.push({name: Application.Section.Profile})
            }
            catch(err){
                expect(err.code).toBe(1)
            }
            await flushPromises()
            expect(application.section).toBe(Application.Section.Profile)
            expect(wrapper.vm.$route.name).toBe(Application.Section.Profile)
            expect(wrapper.text()).not.toContain('Войти через ВКонтакте')
            expect(application.infos).toHaveLength(1)
            expect(wrapper.text()).toContain('Язык')
        })
        it('/witness', async () => {
            try {
                await wrapper.vm.$router.push({name: Application.Section.Witness})
                throw new Error('should not be hire')
            } catch (err) {
                if (!err.type) {
                    throw err
                }
                expect(application.section).toBe(Application.Section.Main)
                await flushPromises()
                expect(wrapper.vm.$route.name).toBe(Application.Section.Main)
                expect(wrapper.text()).not.toContain('Войти через ВКонтакте')
                expect(application.infos).toHaveLength(1)
            }
        })
    })
})