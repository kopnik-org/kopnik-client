import {sync, collection, scalar, object} from '../decorators/sync'
import AbstractSync from "./AbstractSync";
import {container} from "../bottle/bottle";


export default class Kopa extends AbstractSync {
    @scalar id = undefined

    @scalar subject = undefined
    /**
     *
     * @type {Kopnik}
     */
    @object initiator = undefined
    /**
     *
     * @type {Kopnik[]}
     */
    @collection participants = []

    stupidAddParticipant(who) {
        this.participants.push(who)
    }

    /**
     * Пригласить копника
     *
     * @param {Kopnik} who
     */
    addParticipant(who) {
        if (this.isParticipantAdded(who)) {
            return
        }
        if (this.participants.length < 10) {
            this.participants.push(who)
        }
    }

    /**
     * не звать на копу
     * @param {Kopnik} who
     */
    removeParticipant(who) {
        let index = this.participants.indexOf(who)
        if (index === -1) {
            return
        }
        this.participants.splice(index, 1)
    }

    /**
     * Приглашен на копу?
     * @returns {Boolean} индекс
     */
    isParticipantAdded(who) {
        return this.participants.includes(who)
    }

    /**
     * Звать - не звать поменять наоборот
     * @param {Kopnik} who
     */
    toggleParticipant(who) {
        if (this.isParticipantAdded(who)) {
            this.removeParticipant(who)
        } else {
            this.addParticipant(who)
        }
    }
}
