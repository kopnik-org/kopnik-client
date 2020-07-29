import {bottle, container} from "../bottle/bottle";
import {Kopnik} from "../models";
import Application from "./Application";
import {LatLng, LatLngBounds} from "leaflet";
import flushPromises from "flush-promises";
import AbstractSync from "../models/AbstractSync";
import api from '../api'

// real fetch
container.constants.di.fetch = true

describe('Application confirmed', () => {
    /** @type {Application} */
    let application
    /** @type {Kopnik} */
    let user

    beforeAll(async () => {
        // сбросить cookieService, потому что кука тоже устанавливается
        bottle.resetProviders(['cookieService'])

        user = await Kopnik.create({
            status: Kopnik.Status.CONFIRMED,
        }, 'confirmed')
        await user.login()
    })

    beforeEach(() => {
        // сбросить application, потому что в конце каждого теста user уже установлен
        bottle.resetProviders(['application',])
        application = container.application
    })

    it('forwardUserToBeConfirmed()', async () => {
        application.user= user
        const result= await application.forwardUserToBeConfirmed()
        expect(result).toBeFalsy()
        expect(application.section).toBe(Application.Section.Main)
        expect(application.infos).toHaveLength(0)
    })
    it('authenticate()', async () => {
        await application.authenticate()
        expect(application.user).toBeInstanceOf(Kopnik)
    })
    it('loadTop20()', async () => {
        application.sections.main.map.bounds=new LatLngBounds(new LatLng(-90,-180), new LatLng(90, 180))
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
        it('thanks', async () => {
            await application.setSection(Application.Section.Thanks)
            expect(application.section).toBe(Application.Section.Thanks)
        })
    })
})
