/**
 * Created by alexey2baranov on 5/13/16.
 */


"use strict";
import _ from "lodash"

import * as models from "."
import once from "../decorators/once";
import {container} from "../bottle/bottle";
import {Kopnik} from ".";
import parse from "@/models/utils/parse";

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

    this.log = container.logger.getLogger(this.constructor.name)

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
      id: this.id,
      isLoaded: this.isLoaded,
    }

    for (let eachScalarName of this.constructor.scalars.concat("id")) {
      result[eachScalarName] = this[eachScalarName]
    }
    for (let eachObjectName of this.constructor.objects) {
      result[eachObjectName] = (this[eachObjectName] instanceof AbstractSync) ? this[eachObjectName].id : this[eachObjectName]
    }
    for (let eachCollectionName of this.constructor.collections) {
      result[eachCollectionName] = (this[eachCollectionName] instanceof Array) ? this[eachCollectionName].map(eachItem => {
        return eachItem.id
      }) : this[eachCollectionName]
    }
    return result;
  }


  static clearCache() {
    this.cache.forEach(eachCache => eachCache.clear())
  }


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
          let {id, created} = await Connection.getInstance().session.call("fetchApi:model.create", [], {
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
              await Connection.getInstance().session.call("fetchApi:model.destroy", [], {
                  type: this.constructor.name,
                  id: this.id
              })
          } else {
              this.constructor.cache.getInstance(this.constructor.name).delete(this.id)
              this.id = undefined

              await this.unsubscribeFromWAMPPublications()
          }
      }*/

  /**
   * @param id
   * @returns {this}
   */
  static getReference(id) {
    if (!id && id !== 0) {
      throw new Error("Не указан идентификатор объекта id=" + JSON.stringify(id));
    }
    if (_.isString(id)) {
      id = parseInt(id)
    }
    if (!this.cache.has(className(this))) {
      throw new Error("Неправильный тип объекта " + className(this))
    }

    if (!this.cache.get(className(this)).has(id)) {
      let reference = new this()

      reference.id = id
      reference.isLoaded = false

      this.cache.get(className(this)).set(id, reference)
    }
    return this.cache.get(className(this)).get(id)
  }

  static async api(url, options = {}) {
    let api = container.api

    let fullUrl = `${className(this).replace('Kopnik', 'User').toLowerCase()}s/${url}`
    let result = await api(fullUrl, options)
    return result
  }

  /**
   * Загрузить сущности по урлу
   *
   * @param {string} what url эндпоинта для загрузки сущностей
   * @return {Promise<AbstractSync[]> | Promise<AbstractSync>} сущности с проставленными isLoaded
   */
  static async reload(what) {
    /** @type {object[] | object} */
    const resultJSON = await this.api(what)

    // привожу один элемент в массив для универсальной обработки
    const result = [].concat(resultJSON).map(eachResultJSON => {
      const eachResult = new this
      eachResult.merge(parse(this, eachResultJSON))
      eachResult.isLoaded = true
      return eachResult
    })

    return Array.isArray(resultJSON) ? result : result[0]
  }

  /**
   * Получить модель
   *
   * @param {number } id
   * @return {Promise.<*>}
   */
  static async get(id) {
    let result

    result = this.getReference(id)
    await result.loaded()
    return result
  }

  /**
   * Мержит филдсет в кэш моделей
   *
   * @param {Partial<AbstractSync>} what
   * @returns {AbstractSync}
   */
  static merge(what) {
    let result
    result = this.getReference(what.id)
    result.merge(what)

    return result
  }

  static async list() {
    let json = await this.api("list"),
      result = Promise.all(json.users.map(eachModel => this.get(eachModel)))

    return result
  }

  /**
   * загружает все поля в томи числе скалярные и ссылки на другие объеты
   * @returns {Promise<AbstractSync>}
   */
  @once
  async reload() {
    let json = await this.constructor.api(`get?ids=${this.id === undefined ? '' : this.id}`)
    this.merge(parse(this.constructor, json[0]))
    this.isLoaded = true
    return this;
  }

  /**
   * Возвращает загруженный объект
   * если он еще не загружен, то загружает
   * @returns {Promise.<AbstractSync>}
   */
  @once
  async loaded() {
    if (!this.isLoaded) {
      await this.reload()
    }
    return this
  }

  /**
   *
   * @param {Partial<AbstractSync>} set
   * @return {AbstractSync}
   */
  merge(set) {
    for (let eachFieldName of ["id", ...this.constructor.scalars]) {
      if (set[eachFieldName] !== undefined) {
        this[eachFieldName] = set[eachFieldName]
      }
    }
    for (let eachFieldName of [...this.constructor.objects]) {
      if (set[eachFieldName] !== undefined) {
        this[eachFieldName] = set[eachFieldName] === null ? null : models.Kopnik.getReference(set[eachFieldName].id).merge(set[eachFieldName])
      }
    }
    for (let eachFieldName of [...this.constructor.collections]) {
      if (set[eachFieldName] !== undefined) {
        this[eachFieldName] = set[eachFieldName].map(eachCollectionItem => {
          return models.Kopnik.getReference(eachCollectionItem.id).merge(eachCollectionItem)
        })
      }
    }
    if (set.isLoaded === true) {
      this.isLoaded = true
    }
    return this
  }

  toString() {
    return `${className(this.constructor)} {${this.id}:"${this.name}"}`;
  }
}

["Kopnik", "Kopa"].forEach(eachModelName => AbstractSync.cache.set(eachModelName, new Map()))

