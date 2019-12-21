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


    static async getByUid(uid) {
        let json = await this.fetchApi(`getByUid?uid=${uid}`)
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
        if (result.photo = '@todo') {
            result.photo = '/avatar.png'
        }
        return result
    }


    async putWitnessRequest(request) {
        return await this.constructor.fetchApi("putWitnessRequest", {
            method: 'POST',
            body: JSON.stringify(request)
        })
    }

    async patchWitnessRequest(witnessRequest, status) {
        let result = await this.constructor.fetchApi('patchWitnessRequest', {
            id: witnessRequest.id,
            status
        })
        if (result) {
            witnessRequest.status = status
        }
    }

    async patchLocale() {
        await this.constructor.fetchApi('patchLocale', {
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
