import {sync, collection, scalar, object} from './decorators/sync'
import AbstractSync from "./AbstractSync";

export default class Kopnik extends AbstractSync {
    hash = undefined
    uid = undefined

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

    @object foreman = undefined
    @object witness = undefined

    @collection ten

    get name() {
        return `${this.firstName} ${this.lastName} ${this.patronymic}`
    }

    /**
     * Получить идентификатор пользователя по идентификатору ВК
     * @returns {Promise.<Number>}
     */
    async static getByUid(uid) {
        let result = await this.fetch(`vkUserStatus?uid=${uid}`)
        return result
    }


    async sendWitnessRequest(request) {
        return await this.constructor.fetch("witness_request", {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                Accept: "plain/text"
            }
        })
    }
}
