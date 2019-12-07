import {sync, collection, scalar, object} from './decorators/sync'
import AbstractSync from "./AbstractSync";

export default class Kopnik extends AbstractSync {
    @scalar hash = undefined

    @scalar surname = undefined
    @scalar firstname = undefined
    @scalar patronymic = undefined
    @scalar nickname = undefined

    @scalar birthyear = undefined
    @scalar passport = undefined
    @scalar location = undefined
    @scalar photo = undefined
    @scalar smallPhoto = undefined

    @object foreman = undefined
    @object witness = undefined

    @collection ten

    get name() {
        return `${this.firstname} ${this.surname} ${this.patronymic}`
    }

    /**
     * Получить идентификатор пользователя по идентификатору ВК
     * @returns {Promise.<Number>}
     */
    static async getVkUserStatus(uid) {
        let result = await this.fetch(`vkUserStatus?uid=${uid}`)
        return result
    }


    async sendWitnessRequest(request) {
        return await this.constructor.fetch("witness_request", {
            method: 'POST',
            body: JSON.stringify(request),
            headers:{
                Accept: "plain/text"
            }
        })
    }
}
