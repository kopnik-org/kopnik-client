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
    @collection witnessRequests

    get name() {
        return [this.lastName, this.firstName, this.patronymic].filter(each => each).join(' ')
    }

    get rankName(){
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

    async reload() {
        let result = await super.reload()
        if (result.photo == '@todo') {
            result.photo = '/avatar.png'
        }
        if (result.rank==undefined){
            result.rank=1
        }
        return result
    }


    async update(data) {
        data.update = true
        return await this.constructor.api("update", {
            method: 'POST',
            body: data
        })
    }

    async patchWitnessRequest(witnessRequest, status) {
        let result = await this.constructor.api('patchWitnessRequest', {
            id: witnessRequest.id,
            status
        })
        if (result) {
            witnessRequest.status = status
        }
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
