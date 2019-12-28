import {sync, collection, scalar, object} from '../decorators/sync'
import AbstractSync from "./AbstractSync";


export default class Kopnik extends AbstractSync {
    @scalar id = undefined

    @scalar theme = undefined
    @object initiator = undefined
    @collection parts = []

    /**
     * Пригласить копника
     *
     * @param {Kopnik} who
     */
    invite(who){
        if (this.isInvited(who)){
            return
        }
        if (this.parts.length<10){
            this.parts.push(who)
        }
    }

    /**
     * не звать на копу
     * @param who
     */
    back(who){
        let index= this.parts.indexOf(who)
        if (index===-1){
            return
        }
        this.parts.splice(index,1)
    }

    /**
     * Приглашен на копу?
     * @returns {Boolean} индекс
     */
    isInvited(who){
        return this.parts.indexOf(who)!==-1
    }

    /**
     * Звать - не звать поменять наоборот
     * @param who
     */
    toggle(who){
        if (this.isInvited(who)){
            this.back(who)
        }
        else {
            this.invite(who)
        }
    }

    inviteAll(){
        alert("СОЗВАТЬ ВСЕХ НА КОПУ В РАЗРАБОТКЕ")
        this.parts.splice(0)
    }
}
