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

    @object foreman = undefined
    @object witness = undefined

    @collection ten
    @collection witnessRequests

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


    async putWitnessRequest(request) {
        return await this.constructor.fetch("putWitnessRequest", {
            method: 'POST',
            body: JSON.stringify(request)
        })
    }

    async confirm(witnessRequest){
        let result= await this.constructor.fetch('confirm?id='+witnessRequest.id)
        if (result){
            witnessRequest.status = Kopnik.Status.CONFIRMED
        }
    }

    async decline(witnessRequest){
        await this.constructor.fetch('decline?id='+witnessRequest.id)
        if (result){
            witnessRequest.status = Kopnik.Status.DECLINED
        }
    }
}

Kopnik.Status={
    NEW: 0,
    PENDING: 1,
    CONFIRMED: 2,
    DECLINED: 3,
}
