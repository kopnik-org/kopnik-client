import {bottle, container} from "../bottle/bottle";
import {Kopnik} from "../models";
import Application from "./Application";
import {LatLng, LatLngBounds} from "leaflet";
import flushPromises from "flush-promises";
import AbstractSync from "../models/AbstractSync";
import api from '../api'

// real fetch
container.constants.di.fetch = true

describe('Application anonymous', () => {
    /** @type {Application} */
    let application

    beforeEach(() => {
        // сбросить application, потому что в конце каждого теста user уже установлен
        bottle.resetProviders(['application',])
        application = container.application
    })

    it('forwardUserToBeConfirmed()', async () => {
        const result= await application.forwardUserToBeConfirmed()
        expect(result).toBeTruthy()
        expect(application.section).toBe(Application.Section.Main)
    })
    it('authenticate()', async () => {
        await application.authenticate()
        expect(application.user).toBe(null)
    })
    it('loadTop20()', async () => {
        application.sections.main.map.bounds= new LatLngBounds(new LatLng(-90, -180), new LatLng(90, 180))
        try {
            await application.sections.main.loadTop20()
            throw new Error('Should not be hire')
        } catch (err) {
            expect(err).toBeKopnikError(401)
        }
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
