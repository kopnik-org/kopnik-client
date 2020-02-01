import {sync, collection, scalar, object} from '../decorators/sync'
import AbstractSync from "./AbstractSync";


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
    @scalar locale = undefined

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
        if (this.photo === '@todo') {
            this.photo = '/avatar.png'
        }
        if (!this.rank) {
            this.rank = 1
        }
        if (this.location instanceof Array) {
            // result.location={lat: result.location[0], lng: result.location[1]}
        }
    }


    async update(data) {
        data.update = true
        return await this.constructor.api("update", {
            method: 'POST',
            body: data
        })
    }

    async updateWitnessRequestStatus(joining) {
        let result = await this.constructor.api('pending/update', {
            method: 'post',
            body: {
                id: joining.id,
                status: joining.status,
            },
        })
        return result
    }

    async reloadWitnessRequests() {
        let result = await this.constructor.api('pending')
        this.witnessRequests= result.map(eachKopnikAsJson=>Kopnik.merge(eachKopnikAsJson))
    }

    async patchLocale() {
        await this.constructor.api('patchLocale', {
            method: 'POST',
            body: {
                locale: this.locale
            }
        })
    }
}

Kopnik.Status = {
    NEW: 0,
    PENDING: 1,
    CONFIRMED: 2,
    DECLINED: 3,
}
