import {bottle, container} from "../../src/bottle/bottle";
import {Kopnik} from "../../src/models";
import Application from "../../src/application/Application";
import {LatLng, LatLngBounds} from "leaflet";
import flushPromises from "flush-promises";

describe('unit/Application', () => {
    /** @type {Application} */
    let application
    beforeEach(() => {
        // сбросить application, потому что в конце каждого теста user уже установлен
        // сбросить cookieService, потому что кука тоже устанавливается
        bottle.resetProviders(['application', 'cookieService'])
        application = container.application
    })
    describe ("common", ()=>{
        it ('getMessage',()=>{
            expect(application.getMessage('profile.firstName')).toBe('Имя')
        })
    })

    describe('anonymous', () => {
        it('authenticate()', async () => {
            await application.authenticate()
            expect(application.user).toBe(null)
        })
        describe('setSection', () => {
            it('profile', async () => {
                await application.setSection(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Main)
            })
            it('Witness', async () => {
                await application.setSection(Application.Section.Witness)
                expect(application.section).toBe(Application.Section.Main)
            })
            it('thanks', async () => {
                await application.setSection(Application.Section.Thanks)
                expect(application.section).toBe(Application.Section.Thanks)
            })
        })
    })

    describe('status=new', () => {
        beforeEach(async () => {
            await login(2)
        })
        it('authenticate()', async () => {
            await application.authenticate()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it('resolveUser()', async () => {
            await application.resolveUser()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it.skip('top20()', async () => {
            await application.loadTop20()
            expect(application.top20).toBeInstanceOf(Array)
        })
        describe('setSection', () => {
            it('profile', async () => {
                await application.setSection(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Profile)
            })
            it('Witness', async () => {
                await application.setSection(Application.Section.Witness)
                expect(application.section).toBe(Application.Section.Main)
            })
            it('thanks', async () => {
                await application.setSection(Application.Section.Thanks)
                expect(application.section).toBe(Application.Section.Thanks)
            })
        })
        it('logout', async () => {
            await application.setSection(Application.Section.Profile)
            await application.logout()
            expect(application.section).toBe(Application.Section.Main)
            expect(application.user).toBeNull()
            expect(container.cookieService.cookie).toBeNull()
        })

        // TODO: https://github.com/kopnik-org/kopnik-client/issues/14
        it.skip('onerror(401)', async () => {
            await application.setSection(Application.Section.Profile)
            container.cookieService.pop()
            await Kopnik.get(666)
            await flushPromises()
            expect(application.section).toBe(Application.Section.Main)
            expect(application.user).toBeNull()
            expect(container.cookieService.cookie).toBeNull()
        })
    })

    describe('status=pending', () => {
        beforeEach(async () => {
            await login(3)
        })
        it('authenticate()', async () => {
            await application.authenticate()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it('resolveUser()', async () => {
            await application.resolveUser()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it.skip('top20()', async () => {
            await application.loadTop20()
            expect(application.top20).toBeInstanceOf(Array)
        })
        describe('setSection', () => {
            it('profile', async () => {
                await application.setSection(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Profile)
            })
            it('Witness', async () => {
                await application.setSection(Application.Section.Witness)
                expect(application.section).toBe(Application.Section.Main)
            })
        })
    })

    describe('status=confirmed', () => {
        beforeEach(async () => {
            await login(5)
        })
        it('authenticate()', async () => {
            await application.authenticate()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it('resolveUser()', async () => {
            await application.resolveUser()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it('top20()', async () => {
            application.sections.main.map.bounds = new LatLngBounds(new LatLng(-90,-180), new LatLng(90, 180))
            await application.sections.main.loadTop20()
            expect(application.sections.main.top20).toBeInstanceOf(Array)
        })
        describe('setSection', () => {
            it('profile', async () => {
                await application.setSection(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Profile)
            })
            it('Witness', async () => {
                await application.setSection(Application.Section.Witness)
                expect(application.section).toBe(Application.Section.Witness)
            })
        })
    })

    describe('status=declined', () => {
        beforeEach(async () => {
            await login(4)
        })
        it('authenticate()', async () => {
            await application.authenticate()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it('resolveUser()', async () => {
            await application.resolveUser()
            expect(application.user).toBeInstanceOf(Kopnik)
        })
        it.skip('top20()', async () => {
            await application.loadTop20()
            expect(application.top20).toBeInstanceOf(Array)
        })
        describe('setSection', () => {
            it('profile', async () => {
                await application.setSection(Application.Section.Profile)
                expect(application.section).toBe(Application.Section.Profile)
            })
            it('Witness', async () => {
                await application.setSection(Application.Section.Witness)
                expect(application.section).toBe(Application.Section.Main)
            })
        })
    })
})
