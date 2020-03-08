import {sync, collection, scalar, object} from '../decorators/sync'
import AbstractSync from "./AbstractSync";
import {KopnikError} from '../KopnikError'
import Locale from "../locales/Locale";
import {container} from "../bottle/bottle";


export default class Kopnik extends AbstractSync {
    @scalar uid = undefined

    @scalar lastName = undefined
    @scalar firstName = undefined
    @scalar patronymic = undefined
    @scalar nickname = undefined

    @scalar birthyear = undefined
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
    @object witness = undefined

    @collection ten
    @collection tenRequests
    @collection witnessRequests

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
     * @param id
     * @returns {Kopnik}
     */
    static getReference(id) {
        return super.getReference(id)
    }

    async merge(what) {
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
     * @param data
     * @return {Promise<void>}
     */
    async update(data) {
        if (!data.passport) {
            throw new KopnikError('Passport required')
        }
        if (!data.location.lat || !data.location.lng) {
            throw new KopnikError('House location required')
        }
        this.merge({locale: data.locale})
        await this.constructor.api("update", {
            method: 'POST',
            body: data
        })
        this.merge(data)
        this.status = Kopnik.Status.PENDING
    }

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

    async updateLocale() {
        await this.constructor.api('updateLocale', {
            method: 'POST',
            body: {
                locale: this.locale
            }
        })
    }

    async isMessagesFromGroupAllowed() {
        return await this.constructor.api('isMessagesFromGroupAllowed')
    }
}

Kopnik.Status = {
    NEW: 0,
    PENDING: 1,
    CONFIRMED: 2,
    DECLINED: 3,
}
