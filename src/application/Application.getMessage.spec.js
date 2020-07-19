import {container} from "../bottle/bottle"

describe('Application', () => {
    it('getMessage', () => {
        expect(container.application.getMessage('profile.firstName')).toBe('Имя')
    })
})
