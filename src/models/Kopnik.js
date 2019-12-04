import {sync, collection, scalar, object} from './decorators/sync'
import AbstractSync from "./AbstractSync";

export default class Kopnik extends AbstractSync {
    @scalar surname = undefined
    @scalar firstname = undefined
    @scalar patronymic = undefined
    @scalar nickname = undefined

    @scalar birthyear = undefined
    @scalar passport = undefined
    @scalar location = undefined
    photo50 = undefined

    @object foreman = undefined
    @object witness = undefined

    @collection ten

    get name() {
        return `${this.firstname} ${this.surname} ${this.patronymic}`
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