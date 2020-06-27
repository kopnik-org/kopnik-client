import {sync, collection, scalar, object} from '../decorators/sync'
import AbstractSync from "./AbstractSync";
import {container} from "../bottle";


export default class Kopa extends AbstractSync {
    @scalar id = undefined

    @scalar theme = undefined
    /**
     *
     * @type {Kopnik}
     */
    @object initiator = undefined
    /**
     *
     * @type {Kopnik[]}
     */
    @collection parts = []

    stupidAdd(who) {
        this.parts.push(who)
    }

    /**
     * Пригласить копника
     *
     * @param {Kopnik} who
     */
    add(who) {
        if (this.isAdded(who)) {
            return
        }
        if (this.parts.length < 10) {
            this.parts.push(who)
        }
    }

    /**
     * не звать на копу
     * @param {Kopnik} who
     */
    remove(who) {
        let index = this.parts.indexOf(who)
        if (index === -1) {
            return
        }
        this.parts.splice(index, 1)
    }

    /**
     * Приглашен на копу?
     * @returns {Boolean} индекс
     */
    isAdded(who) {
        return this.parts.indexOf(who) !== -1
    }

    /**
     * Звать - не звать поменять наоборот
     * @param {Kopnik} who
     */
    toggle(who) {
        if (this.isAdded(who)) {
            this.remove(who)
        } else {
            this.add(who)
        }
    }

    inviteAll() {
        this.parts.splice(0)
        container.application.errors.push(container.application.getMessage('errors.underConstruction'))
    }
}
