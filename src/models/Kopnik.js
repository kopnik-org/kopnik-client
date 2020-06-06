import {sync, collection, scalar, object} from '../decorators/sync'
import AbstractSync from "./AbstractSync";
import {KopnikError} from '../KopnikError'
import Locale from "../locales/Locale";
import {container} from "../bottle/bottle";
import api from "../api";


export default class Kopnik extends AbstractSync {
    @scalar uid = undefined

    @scalar lastName = undefined
    @scalar firstName = undefined
    @scalar patronymic = undefined
    @scalar nickname = undefined

    @scalar birthyear = undefined
    //строка, т.к. может начинаться на "0"
    @scalar passport = undefined
    @scalar location = undefined
    /**
     *
     * @type {String}
     */
    @scalar photo = undefined
    @scalar smallPhoto = undefined
    @scalar status = undefined
    /** @type {Locale} */
    @scalar locale = container.localeManager.currentLocale
    @scalar role

    @object foreman = undefined
    @object foremanRequest = undefined
    @object witness = undefined

    @collection ten
    @collection foremanRequests
    @collection witnessRequests

    static get Status() {
        return {
            NEW: 0,
            PENDING: 1,
            CONFIRMED: 2,
            DECLINED: 3,
        }
    }

    static get Role() {
        return {
            Kopnik: 1,
            DanilovKopnik: 2,
            FutureKopnik: 3,
            Female: 4,
            Stranger: 5,
        }
    }


    /**
     * Create user in test DB
     * for test purposes only
     *
     * @param {object?} fields
     * @param {string|Date|number?} prefix
     *
     * @returns {Promise<Kopnik>}
     */
    static async create(fields, prefix) {
        const now = new Date()

        if (prefix === undefined) {
            prefix = now.toLocaleTimeString()
        }
        const uniq = now.getTime() * 1000 + now.getMilliseconds()
        const realFields = Object.assign({
            lastName: prefix,
            firstName: prefix,
            patronymic: prefix,
            nickname: prefix,
            birthyear: 2020,
            passport: "0123",
            location: {
                lat: 30,
                lng: 50,
            },
            photo: 'photo/' + prefix,
            smallPhoto: 'smallPhoto/' + prefix,
            status: Kopnik.Status.CONFIRMED,
            locale: container.localeManager.currentLocale.name,
            role: Kopnik.Role.Kopnik,
            identifier: uniq,
            email: uniq + '@kopnik.ru',
            access_token: 'access_token' + uniq,
        }, fields)

        realFields.id = await container.api('test/createUser', {
            method: 'POST',
            body: realFields,
        })
        const result = Kopnik.merge(realFields, true)
        return result
    }

    constructor() {
        super();
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            this.role = 1
        }
    }

    get name() {
        return [this.lastName, this.firstName, this.patronymic].filter(each => each).join(' ')
    }

    get rankName() {
        return this.name + (this.rank > 1 ? ` (+${this.rank})` : '')
    }


    static async getByUid(uid) {
        let json = await this.api(`getByUid?uid=${uid}`)
        if (json) {
            json.loaded = true
            let result = this.merge(json)
            return result
        }
        return null
    }

    /**
     * login for test purpose
     * @returns {Promise<void>}
     */
    async login() {
        await api('test/login/' + this.id)
    }

    /**
     * login for test purpose
     * @returns {Promise<void>}
     */
    async logout() {
        await api('logout')
    }


    /**
     * @param id
     * @returns {Kopnik}
     */
    static getReference(id) {
        return super.getReference(id)
    }

    merge(what) {
        super.merge(what)
        if (!this.rank) {
            this.rank = 1
        }
        if (what.locale !== undefined) {
            this.locale = (what.locale instanceof Locale) ? what.locale : container.localeManager.getLocaleByShortName(what.locale)
        }
        if (this.location instanceof Array) {
            // result.location={lat: result.location[0], lng: result.location[1]}
        }
    }

    get plain() {
        const result = super.plain
        result.locale = this.locale.name
        return result
    }

    /**
     * Подать заявку на заверение себя
     *
     * @param profileJSON
     * @return {Promise<void>}
     */
    async updateProfile(profileJSON) {
        if (!profileJSON.passport) {
            throw new KopnikError('Passport required')
        }
        if (!profileJSON.location.lat || !profileJSON.location.lng) {
            throw new KopnikError('House location required')
        }
        this.merge({locale: profileJSON.locale})
        await this.constructor.api("updateProfile", {
            method: 'POST',
            body: profileJSON
        })
        this.merge(profileJSON)
        this.status = Kopnik.Status.PENDING
    }

    /**
     * Confirm or reject foreign witness request
     *
     * @param witnessRequest
     * @returns {Promise<*>}
     */
    async updateWitnessRequestStatus(witnessRequest) {
        let result = await this.constructor.api('pending/update', {
            method: 'post',
            body: {
                id: witnessRequest.id,
                status: witnessRequest.status,
            },
        })
        return result
    }

    async reloadWitnessRequests() {
        let result = await this.constructor.api('pending')
        this.witnessRequests = result.map(eachKopnikAsJson => Kopnik.merge(eachKopnikAsJson, true))
    }

    async reloadTen() {
        this.ten = []
    }

    /**
     *
     * @param {Locale | {name: string, languageName: string?}} value
     * @returns {Promise<void>}
     */
    async setLocale(value) {
        await this.constructor.api('updateLocale', {
            method: 'POST',
            body: {
                locale: value.name
            }
        })
        this.locale = value
    }

    async isMessagesFromGroupAllowed() {
        return await this.constructor.api('isMessagesFromGroupAllowed')
    }

    /**
     * @param {Kopnik} foreman
     */
    async putForemanRequest(foreman) {
        await this.constructor.api('putForemanRequest', {
            method: "POST",
            body: {
                id: foreman.id,
            }
        })
    }

    /**
     * @param {number} foreman_id
     */
    async reloadForemanRequests() {
        this.foremanRequests = (await this.constructor.api('getForemanRequests'))
            .map(eachUserPlain=>Kopnik.merge(eachUserPlain, true))
    }

    /**
     * @param {Kopnik} requester
     */
    async confirmForemanRequest(requester) {
        const result = await this.constructor.api('confirmForemanRequest', {
            method: 'POST',
            body: {
                id: requester.id,
            },
        })
    }
    /**
     * @param {Kopnik} requester
     */
    async declineForemanRequest(requester) {
        const result = await this.constructor.api('declineForemanRequest', {
            method: 'POST',
            body: {
                id: requester.id,
            },
        })
    }

}
