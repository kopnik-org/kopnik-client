/**
 * Created by alexey2baranov on 5/13/16.
 */
"use strict";
import _ from "lodash"
import loglevel from "loglevel"

import config from "../../config"
import * as models from "."

/**
 * Общий принцип работы следующий
 * #find(id) возвращает объект у которого ассоциации в виде ссылок (не loaded() -нутые объекты)
 * перед тем как такой объект использовать необходимо выполенить его .load()
 *
 * #find(1)
 * .then (kopnik=>{
 *      echo kopnik.iInviteSomebody.id;
 *      kopnik.iInviteSomebody.loaded()
 *      .then(()=>{
 *          echo kopnik.iInviteSomebody.status
 *      })
 * })
 *
 * Для того чтобы сделать объект синхронизированным нужно вызвать .refreshCycle(3000)
 */

export default class AbstractSync {
    static cache = new Map()

    constructor() {

        this.log = loglevel.getLogger(this.constructor.name)

        this.isLoaded = false;
        this.id = undefined;
        this.note = undefined;
        this.attachments = []

        /**
         * у новвой предсозданой на клиенте модели его нет
         * потому что он еще не созан на сервере
         * точно так же как нет и id
         */
        this.created = undefined;
    }
/*

    static factory(from) {
        let [type, id] = from.split(":")

        result = models[type].getReference(id)

        return result
    }
*/

    /**
     * Плоское представление объекта для передачина на сервер
     */
/*
    static getPlain(value) {
        let result = {};
        for (let eachKey of Object.keys(value)) {
            let eachProperty = value[eachKey];

            if (Array.isArray(eachProperty)) {
                result[eachKey] = [];
                for (let eachPropertyEachReference of eachProperty) {
                    if (!_.isObject(eachPropertyEachReference)) {
                        throw new Error(`arrays of AbstractSync only supported, ${typeof eachPropertyEachReference} given`);
                    }
                    if (!(eachPropertyEachReference instanceof AbstractSync)) {
                        throw new Error(`arrays of AbstractSync only supported, ${eachPropertyEachReference.constructor.name} given`);
                    }
                    result[eachKey].push(eachPropertyEachReference.id);
                }
            } else if (_.isObject(eachProperty) && !(eachProperty instanceof Date)) {
                if (!(eachProperty instanceof AbstractSync)) {
                    throw new Error(`reference to AbstractSync only supported, ${eachProperty.constructor.name} given`);
                }
                result[eachKey + "_id"] = eachProperty.id;
            } else {
                result[eachKey] = eachProperty;
            }
        }

        return result;
    }

*/

    static clearCache() {
        this.cache.forEach(eachCache => eachCache.clear())
    }

/*    async save() {
        let plain = this.getPlain()
        let result = await Connection.getInstance().session.call("api:model.save", [], {
            type: this.constructor.name,
            plain: plain
        })
        return result
    }*/

/*    static async create(value) {
        if (!value.attachments) {
            value.attachments = [];
        }
        /!**
         * если сюда передался id, то ниже он перекроет собой настоящий id
         *!/
        delete value.id
        delete value.created
        // let plain= this.getPlain(value);
        let plain = this.prototype.getPlain.call(value);
        let {id, created} = await Connection.getInstance().session.call("api:model.create", [], {
            type: this.name,
            plain: plain
        });
        id = parseInt(id)
        created = new Date(created)

        let result = this.getReference(id)
        Object.assign(result, value)
        result.created = created
        result.isLoaded = true

        await result.subscribeToWAMPPublications();

        return result;
    }*/

/*    async destroy(soft = false) {
        if (!this.id) {
            throw new Error("destroying unsaved model")
        }
        if (!soft) {
            await Connection.getInstance().session.call("api:model.destroy", [], {
                type: this.constructor.name,
                id: this.id
            })
        } else {
            this.constructor.cache.get(this.constructor.name).delete(this.id)
            this.id = undefined

            await this.unsubscribeFromWAMPPublications()
        }
    }*/

    static getReference(id) {
        if (!id) {
            throw new Error("Не указан идентификатор объекта id=" + JSON.stringify(id));
        }
        if (_.isString(id)) {
            id = parseInt(id)
        }
        if (!models[this.name]) {
            throw new Error("Неправильный тип объекта " + this.name)
        }

        if (!this.cache.get(this.name).has(id)) {
            let reference = new this()

            reference.id = id
            reference.isLoaded = false

            this.cache.get(this.name).set(id, reference)
        }
        return this.cache.get(this.name).get(id)
    }

  static async fetch(url, options){
    let fullUrl= `${config.api.path}/${this.name.replace('Kopnik', 'User').toLowerCase()}/${url}`
    let response
    try{
      response = await fetch(fullUrl, options)
    }
    catch(err){
      throw new err.constructor(`api network error url: ${fullUrl}, base error ${err.message}`)
    }
    if (!response.ok){
      throw new Error(`api network error url: ${fullUrl}, status: ${response.status}`)
    }
    let result= await response.json()
    return result
  }

    /**
     * Создает на клиенте isLoaded модель однм из спсобов:
     * 1. загружает из what например после массовой загрузки листа
     * 2. из кэша
     * 3. из севера
     *
     * @param what
     * @return {Promise.<*>}
     */
    static async get(what) {
        let result

        if (_.isNumber(what) || _.isString(what)) {
            result = this.getReference(what)
            if (!result.isLoaded) {
                await result.reload()
            }
            return result
        }
        else {
            result = this.getReference(what.id)
            if (!result.isLoaded) {
                result.merge(what)
                result.isLoaded=true
            }
            return result;
        }
    }

    static async list(){
        let json= await this.fetch("list"),
            result= Promise.all(json.users.map(eachModel=> this.get(eachModel) ))

        return result
    }

    /**
     * загружает все поля в томи числе скалярные и ссылки на другие объеты
     * @returns {Promise.<AbstractSync>}
     */
    async reload() {
      let json= await this.constructor.fetch(this.id)
      this.merge(json.user)
        this.isLoaded=true
      return this;
    }

    /**
     * Возвращает загруженный объект
     * если он еще не загружен, то загружает
     * @returns {Promise.<RemoteEntity>}
     */
    async loaded() {
      if (!this.isLoaded) {
        await this.reload()
      }
      return this
    }

    /**

     */
    merge(plain) {
      for (let eachPropName of Object.keys(plain)) {
        this[eachPropName] = plain[eachPropName]
      }
    }

    toString() {
      return `${this.constructor.name} {${this.id}:"${this.name}"}`;
    }
}

Object.keys(models).forEach(eachModelName=>{
  if (eachModelName != AbstractSync.name) {
    AbstractSync.cache.set(eachModelName, new Map())
  }
})