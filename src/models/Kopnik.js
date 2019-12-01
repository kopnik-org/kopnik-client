import {sync, collection} from './decorators/sync'
import AbstractSync from "./AbstractSync";

export default class Kopnik extends AbstractSync{
    surname = undefined
    firstname = undefined
    patronymic = undefined
    birthday = undefined
    passport= undefined

    latitude = undefined
    longtitude = undefined

    get name(){
        return `${this.firstName} ${this.surname} ${this.patronymic}`
    }
}