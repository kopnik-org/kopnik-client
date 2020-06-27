import {Kopnik, Kopa} from "./index";
import {bottle, container} from "../bottle";
import {KopnikApiError} from "../KopnikError";

describe('unit models Kopa', () => {
    describe('add', () => {
        it('first time', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.add(kopnik1)
            expect(kopa1.parts.indexOf(kopnik1)).toBe(0)
        })

        it('second time', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.add(kopnik1)
            kopa1.add(kopnik1)
            expect(kopa1.parts.indexOf(kopnik1)).toBe(0)
            expect(kopa1.parts.length).toBe(1)
        })
    })
    describe('remove', () => {
        it('present', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.parts.push(kopnik1)
            kopa1.remove(kopnik1)
            expect(kopa1.parts.length).toBe(0)
        })

        it('absent', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.remove(kopnik1)
            expect(kopa1.parts.length).toBe(0)
        })
    })
    describe('isAdded', () => {
        it('present', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.parts.push(kopnik1)
            expect(kopa1.isAdded(kopnik1)).toBeTruthy()
        })

        it('absent', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            expect(kopa1.isAdded(kopnik1)).toBeFalsy()
        })
    })
    describe('toggle', () => {
        it('present', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()

            kopa1.parts.push(kopnik1)
            kopa1.toggle(kopnik1)
            expect(kopa1.parts.length).toBe(0)
        })

        it('absent', async () => {
            let kopnik1 = new Kopnik(),
                kopa1 = new Kopa()
            kopa1.toggle(kopnik1)
            expect(kopa1.parts.length).toBe(1)
        })
    })
})
