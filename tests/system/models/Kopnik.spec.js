import {KopnikApiError} from "../../../src/KopnikError";
import {Kopnik} from "../../../src/models";
import {bottle, container} from "../../../src/plugins/bottle";

container.config.di.fetch=true

describe('system models Kopnik', () => {

    describe('anonymous', () => {
        describe('update', () => {
            it('anonymous@users/update', async () => {
                let kopnik = new Kopnik()
                try {
                    let result = await kopnik.update(kopnik.plain)
                } catch (err) {
                    console.log(err)
                    expect(err).toBeInstanceOf(KopnikApiError)
                    // expect(err.code).toBe(401)
                    expect(err.message).toContain('auth')
                }
            })
        })
    })
    describe('new', () => {
        beforeEach(async ()=>{
            await login(2)
        })
        describe('update', () => {
            it('kopnik2@users/update', async () => {
                let kopnik = await Kopnik.get(2)
                try{
                    await kopnik.update(kopnik.plain)
                }
                catch(err){
                    console.log(err)
                    expect(err).toBeInstanceOf(KopnikApiError)
                    expect(err.code).toBe(510)
                }
            })
        })
    })
    describe('confirmed', () => {
        beforeEach(async ()=>{
            await login(1)
        })
        describe('update', () => {
            it.only('kopnik1@users/update', async () => {
                let kopnik = await Kopnik.get(1)
                // console.log(kopnik.plain)
                let result = await kopnik.update(kopnik.plain)
                expect(result).toMatchSnapshot()
                kopnik.reload()
                expect(kopnik.status).toBe(1)
            })
        })
    })
})
