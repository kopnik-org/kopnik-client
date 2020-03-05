import {sync, collection, scalar, object} from '../decorators/sync'
import AbstractSync from "./AbstractSync";
import {KopnikError} from '../KopnikError'


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
    @scalar locale = 'ru'

    @object foreman = undefined
    @object witness = undefined

    @collection ten
    @collection tenRequests
    @collection witnessRequests

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

    async merge(plain) {
        super.merge(plain)
        if (!this.rank) {
            this.rank = 1
        }
        if (this.location instanceof Array) {
            // result.location={lat: result.location[0], lng: result.location[1]}
        }
    }

    /**
     * Подать заявку на заверение себя
     *
     * @param data
     * @return {Promise<void>}
     */
    async update(data) {
        if (!data.passport){
            throw new KopnikError('Passport required')
        }
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
