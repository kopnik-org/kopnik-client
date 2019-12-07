import {sync, collection, scalar, object} from './decorators/sync'
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

    @object foreman = undefined
    @object witness = undefined

    @collection ten

    get name() {
        return `${this.lastName} ${this.firstName} ${this.patronymic}`
    }


      static async getByUid(uid) {
         let json = await this.fetch(`getByUid?uid=${uid}`)
          if (json) {
              json.loaded = true
              let result = this.merge(json)
              return result
          }
          return null
    }


    async sendWitnessRequest(request) {
        return await this.constructor.fetch("witness_request", {
            method: 'POST',
            body: request //JSON.stringify(request)
        })
    }
}
