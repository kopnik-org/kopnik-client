import {Kopnik, Kopa} from "./index";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";

describe('unit models Kopa', () => {
    describe('add', () => {
        it('first time', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.addParticipant(kopnik1)
            expect(kopa1.participants.indexOf(kopnik1)).toBe(0)
        })

        it('second time', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.addParticipant(kopnik1)
            kopa1.addParticipant(kopnik1)
            expect(kopa1.participants.indexOf(kopnik1)).toBe(0)
            expect(kopa1.participants.length).toBe(1)
        })
    })
    describe('remove', () => {
        it('present', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.participants.push(kopnik1)
            kopa1.removeParticipant(kopnik1)
            expect(kopa1.participants.length).toBe(0)
        })

        it('absent', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.removeParticipant(kopnik1)
            expect(kopa1.participants.length).toBe(0)
        })
    })
    describe('isAdded', () => {
        it('present', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.participants.push(kopnik1)
            expect(kopa1.isParticipantAdded(kopnik1)).toBeTruthy()
        })

        it('absent', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            expect(kopa1.isParticipantAdded(kopnik1)).toBeFalsy()
        })
    })
    describe('toggle', () => {
        it('present', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.participants.push(kopnik1)
            kopa1.toggleParticipant(kopnik1)
            expect(kopa1.participants.length).toBe(0)
        })

        it('absent', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()
            kopa1.toggleParticipant(kopnik1)
            expect(kopa1.participants.length).toBe(1)
        })
    })
})
