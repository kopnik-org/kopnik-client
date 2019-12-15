/**
 * Created by alexey2baranov on 5/13/16.
 */


"use strict";
import _ from "lodash"
import loglevel from "loglevel"

import config from "../../config"
import * as models from "."
import Application from "../Application";
import {KopnikApiError} from "../KopnikError";

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

    get plain() {
        let result = {
            id: this.id
        }

        for (let eachScalarName of this.constructor.scalars.concat("id")) {
            result[eachScalarName] = this[eachScalarName] === undefined ? null : this[eachScalarName]
        }
        for (let eachObjectName of this.constructor.objects) {
            result[eachObjectName + "_id"] = (this[eachObjectName] instanceof AbstractSync) ? this[eachObjectName].id : null
        }
        for (let eachCollectionName of this.constructor.collections) {
            result[eachCollectionName] = (this[eachCollectionName] instanceof Array) ? this[eachCollectionName].map(eachItem => eachItem.plain) : null
        }
        return result;
    }


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
                this.constructor.cache.getInstance(this.constructor.name).delete(this.id)
                this.id = undefined

                await this.unsubscribeFromWAMPPublications()
            }
        }*/

    static getReference(id) {
        if (!id && id!==0) {
            throw new Error("Не указан идентификатор объекта id=" + JSON.stringify(id));
        }
        if (_.isString(id)) {
            id = parseInt(id)
        }
        if (!this.cache.has(this.name)) {
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

    static async fetch(url, options = {}) {
        options.headers = options.headers || {}
        options.credentials = 'include'
        if (!options.headers.Accept) {
            options.headers.Accept = 'application/json'
        }
        if (options.method == "POST" && !options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/json'
        }

        let fullUrl = `${config.api.path}/${this.name.replace('Kopnik', 'User').toLowerCase()}s/${url}`

        let response
        try {
            response = await fetch(fullUrl, options)
        } catch (err) {
            throw new err.constructor(`kopnik.org API network error url: ${fullUrl}, base error ${err.message}`)
        }
        if (!response.ok) {
            throw new Error(`kopnik.org API network error url: ${fullUrl}, status: ${response.status}`)
        }
        let result
        if (options.headers.Accept == "application/json") {
            result = await response.json()
            if (result.error) {
                let err = new KopnikApiError(result.error.error_msg, result.error.error_code, fullUrl, result.status)
                throw err
            }
            return result.response
        } else {
            result = await response.text()
            return result
        }
    }

    /**
     * Получить модель
     *
     * @param id
     * @return {Promise.<*>}
     */
    static async get(id) {
        let result

        result = this.getReference(id)
        await result.loaded()
        return result
    }

    /**
     * Мержит плоский объект или модель в кэш моделей
     *
     * @param {Object | AbstractAsync} what
     * @returns {*}
     */
    static merge(what) {
        let result
        result = this.getReference(what.id)
        result.merge(what)

        return result
    }

    static async list() {
        let json = await this.fetch("list"),
            result = Promise.all(json.users.map(eachModel => this.get(eachModel)))

        return result
    }

    /**
     * загружает все поля в томи числе скалярные и ссылки на другие объеты
     * @returns {Promise.<AbstractSync>}
     */
    async reload() {
        let json = await this.constructor.fetch(`get?ids=${this.id}`)
        this.merge(json[0])
        this.isLoaded = true
        return this;
    }

    /**
     * Возвращает загруженный объект
     * если он еще не загружен, то загружает
     * @returns {Promise.<AbstractSync>}
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
        for (let eachScalarName of this.constructor.scalars.concat("id")) {
            if (plain[eachScalarName] !== undefined) {
                this[eachScalarName] = plain[eachScalarName]
            }
        }
        for (let eachObjectName of this.constructor.objects) {
            if (plain[eachObjectName + "_id"] !== undefined) {
                this[eachObjectName] = plain[eachObjectName + "_id"] === null ? null : models.Kopnik.getReference(plain[eachObjectName + "_id"])
            }
        }
    }

    toString() {
        return `${this.constructor.name} {${this.id}:"${this.name}"}`;
    }
}

["Kopnik", "Kopa"].forEach(eachModelName => AbstractSync.cache.set(eachModelName, new Map()))
