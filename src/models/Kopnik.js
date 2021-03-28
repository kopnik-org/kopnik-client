import {sync, collection, scalar, object} from '../decorators/sync'
import AbstractSync from "./AbstractSync";
import {KopnikError} from '../KopnikError'
import Locale from "../locales/Locale";
import {container} from "../bottle/bottle";
import api from "../api";
import once from '../decorators/once'


let TEST_ID = -1

export default class Kopnik extends AbstractSync {
  @scalar lastName = undefined
  @scalar firstName = undefined
  @scalar patronymic = undefined
  @scalar nickname = undefined
  @scalar rank = undefined

  @scalar birthYear = undefined
  //строка, т.к. может начинаться на "0"
  @scalar passport = undefined
  @scalar location = undefined

  @scalar isWitness = undefined
  @scalar witnessRadius = undefined
  /**
   *
   * @type {String}
   */
  @scalar photo = undefined
  @scalar status = undefined
  /** @type {Locale} */
  @scalar locale = container.localeManager.currentLocale
  @scalar role
  @scalar tenChatInviteLink
  /* @type {string} */
  @scalar mid
  @scalar witnessChatInviteLink
  @scalar tenChatInviteLink
  @scalar foremanRequestChatInviteLink

  @object foreman = undefined
  @object foremanRequest = undefined
  @object witness = undefined

  @collection /** @type {Kopnik[]} */ subordinates
  @collection /** @type {Kopnik[]} */ foremanRequests
  @collection /** @type {Kopnik[]} */ witnessRequests

  static get Status() {
    return {
      NEW: 0,
      PENDING: 1,
      CONFIRMED: 2,
      DECLINED: 3,
    }
  }

  static get Role() {
    return {
      Kopnik: 1,
      DanilovKopnik: 2,
      FutureKopnik: 3,
      Female: 4,
      Stranger: 5,
    }
  }


  /**
   * Create user in test DB
   * for test purposes only
   *
   * @param {{id: number?, isLoaded:boolean?, status:number?, role: string?, foreman_id: number?, foremanRequest_id: number?, witness_id:number?, isWitness: boolean?,}?} fields
   * @param {string|Date|number?} prefix
   *
   * @returns {Promise<Kopnik>}
   */
  static async create(fields, prefix) {
    const now = new Date()

    if (prefix === undefined) {
      prefix = now.toLocaleTimeString()
    }
    const uniqAsNumber = now.getTime() * 1000 + now.getMilliseconds()
    const realFields = Object.assign({
      lastName: prefix,
      firstName: prefix,
      patronymic: prefix,
      nickname: prefix,
      birthYear: 2020,
      passport: "0123",
      location: {
        lat: 30,
        lng: 50,
      },
      photo: 'photo/' + prefix,
      status: Kopnik.Status.CONFIRMED,
      locale: container.localeManager.currentLocale.name,
      role: Kopnik.Role.Kopnik,
      rank: 1,
      mid: uniqAsNumber,
      email: uniqAsNumber + '@kopnik.ru',
      access_token: 'access_token' + uniqAsNumber,
    }, fields)

    if (!fields || !fields.isLoaded) {
      realFields.id = await container.api('test/createUser', {
        method: 'POST',
        body: realFields,
      })
    } else if (!realFields.id) {
      realFields.id = TEST_ID--
    }
    const result = Kopnik.merge(realFields, true)
    return result
  }

  constructor() {
    super();
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      this.role = 1
    }
  }

  get name() {
    return [this.firstName, this.patronymic, this.lastName,].filter(each => each).join(' ')
  }

  get rankName() {
    return this.name + ` (+${this.rank})`
  }


  static async getByUid(uid) {
    let json = await this.api(`getByUid?uid=${uid}`)
    if (json) {
      json.loaded = true
      let result = this.merge(json)
      return result
    }
    return null
  }

  /**
   * login for test purpose
   * @returns {Promise<void>}
   */
  async login() {
    container.api['T-Authorization'] = this.mid
  }

  /**
   * login for test purpose
   * @returns {Promise<void>}
   */
  async logout() {
    delete container.api['T-Authorization']
  }


  /**
   * @param id
   * @returns {Kopnik}
   */
  static getReference(id) {
    return super.getReference(id)
  }

  merge(what) {
    super.merge(what)
    if (what.locale !== undefined) {
      this.locale = (what.locale instanceof Locale) ? what.locale : container.localeManager.getLocaleByShortName(what.locale)
    }
  }

  get plain() {
    const result = super.plain
    result.locale = this.locale.name
    return result
  }

  /**
   * returns all available (loaded) foremans
   * @return {Kopnik[]}
   */
  get foremans() {
    const result = []
    for (let eachForeman = this.foreman; eachForeman; eachForeman = eachForeman.foreman) {
      result.push(eachForeman)
    }
    return result
  }

  /**
   * Подать заявку на заверение себя
   *
   * @param profileJSON
   * @param {string[]} changeset
   * @return {Promise<void>}
   */
  async updateProfile(profileJSON, changeset) {
    if (!profileJSON.passport) {
      throw new KopnikError('Passport required')
    }
    if (!profileJSON.location.lat || !profileJSON.location.lng) {
      throw new KopnikError('House location required')
    }
    this.merge({locale: profileJSON.locale})

    let promise= this.constructor.api("updateProfile", {
      method: 'POST',
      body: {
        ...profileJSON,
        changeset,
        changesetTranslated: changeset.map(eachField => container.application.getMessage(`profile.${eachField}`))
      }
    })


    await promise

    this.merge(profileJSON)
    this.status = Kopnik.Status.PENDING
  }

  /**
   * Confirm or reject foreign witness request
   *
   * @param request
   * @returns {Promise<*>}
   */
  async resolveWitnessRequest(request) {
    let result = await this.constructor.api('resolveWitnessRequest', {
      method: 'post',
      body: {
        id: request.id,
        status: request.status,
      },
    })
    if (this.witnessRequests) {
      this.witnessRequests.splice(this.witnessRequests.indexOf(request), 1)
    }
    return result
  }

  @once
  async reloadWitnessRequests() {
    let result = await this.constructor.api('getWitnessRequests')
    this.witnessRequests = result.map(eachKopnikAsJson => Kopnik.merge(eachKopnikAsJson, true))
  }

  /**
   *
   * @param {Locale | {name: string, languageName: string?}} value
   * @returns {Promise<void>}
   */
  async setLocale(value) {
    await this.constructor.api('updateLocale', {
      method: 'POST',
      body: {
        locale: value.name
      }
    })
    this.locale = value
  }

  @once
  async isMessagesFromGroupAllowed() {
    const result = await this.constructor.api('isMessagesFromGroupAllowed')
    return result
  }

  /**
   * @param {Kopnik|null} foremanRequest
   */
  async putForemanRequest(foremanRequest) {
    await this.constructor.api('putForemanRequest', {
      method: "POST",
      body: {
        id: foremanRequest ? foremanRequest.id : null,
      }
    })
    // убираем себя из заявок старого потенциального старшины
    if (this.foremanRequest && this.foremanRequest.foremanRequests) {
      this.foremanRequest.foremanRequests.splice(this.foremanRequest.foremanRequests.indexOf(this), 1)
    }
    // назначаем нового потенциального старшину
    this.foremanRequest = foremanRequest

    // добавляем в заявки новому потенциальному старшине
    if (this.foremanRequest && this.foremanRequest.foremanRequests) {
      this.foremanRequest.foremanRequests.push(this)
    }

  }


  //
  /**
   * @returns {Promise<Kopnik[]>}
   */
  async getForemanRequests() {
    let resultAsJson = await this.constructor.api('getForemanRequests')
    const result = resultAsJson.map(eachResultAsJson => Kopnik.merge(eachResultAsJson, true))
    return result
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async reloadForemanRequests() {
    this.foremanRequests = await this.getForemanRequests()
  }

  /**
   * @returns {Promise<Kopnik[]>}
   */
  @once
  async loadedForemanRequests() {
    if (!this.foremanRequests) {
      await this.reloadForemanRequests()
    }
    return this.foremanRequests
  }

  /**
   * @param {Kopnik} requester
   */
  async confirmForemanRequest(requester) {
    const result = await this.constructor.api('resolveForemanRequest', {
      method: 'POST',
      body: {
        id: requester.id,
        status: true,
      },
    });
    [this, ...this.foremans].forEach(eachForeman => eachForeman.rank += requester.rank)
    if (this.foremanRequests) {
      this.foremanRequests.splice(this.foremanRequests.indexOf(requester), 1)
    }
    if (this.subordinates) {
      this.subordinates.push(requester)
    }
    requester.foremanRequest = null
    requester.foreman = this
  }

  /**
   * @param {Kopnik} requester
   */
  async declineForemanRequest(requester) {
    const result = await this.constructor.api('resolveForemanRequest', {
      method: 'POST',
      body: {
        id: requester.id,
        status: false,
      },
    })
    if (this.foremanRequests) {
      this.foremanRequests.splice(this.foremanRequests.indexOf(requester), 1)
    }
    requester.foremanRequest = null
  }

  /**
   * @returns {Promise<Kopnik[]>}
   */
  async getSubordinates() {
    let subordinatesAsJson = await this.constructor.api('getSubordinates?id=' + this.id)
    const result = subordinatesAsJson.map(eachSubordinateAsJson => Kopnik.merge(eachSubordinateAsJson, true))
    return result
  }

  async reloadSubordinates() {
    this.subordinates = await this.getSubordinates()
  }

  /**
   * @returns {Promise<Kopnik[]>}
   */
  @once
  async loadedSubordinates() {
    if (!this.subordinates) {
      await this.reloadSubordinates()
    }
    return this.subordinates
  }

  /**
   * @returns {Promise<void>}
   */
  @once
  async resetForeman() {
    await this.constructor.api('resetForeman', {
      method: 'POST',
    })
    this.foremans.forEach(eachForeman => eachForeman.rank -= this.rank)
    if (this.foreman && this.foreman.subordinates) {
      this.foreman.subordinates.splice(this.foreman.subordinates.indexOf(this), 1)
    }
    this.foreman = null
  }

  /**
   * @param {Kopnik} subordinate для какого Пользователя перестать быть старшиной
   * @returns {Promise<void>}
   */
  async removeFromSubordinates(subordinate) {
    await this.constructor.api('resetForeman', {
      method: 'POST',
      body: {
        id: subordinate.id,
      },
    });
    [this, ...this.foremans].forEach(eachForeman => eachForeman.rank -= subordinate.rank)
    if (this.subordinates) {
      this.subordinates.splice(this.subordinates.indexOf(subordinate), 1)
    }
    subordinate.foreman = null
  }

  /**
   * Обновляет не только себя, но и связанные с собой объекты
   * @returns {Promise<AbstractSync>}
   */
  @once
  async reloadEx() {
    // текущее состояние
    const actual = await this.constructor.api(`getEx`)

    // неопределеним если прилетел json-объект ошибки
    actual.subordinates = actual.subordinates instanceof Array ? actual.subordinates : undefined
    actual.foremanRequests = actual.foremanRequests instanceof Array ? actual.foremanRequests : undefined
    actual.witnessRequests = actual.witnessRequests instanceof Array ? actual.witnessRequests : undefined

    // старшина исключил из десятки
    if (this.foreman && !actual.foreman_id) {
      // удяляю себя из подчиненных старшины
      if (this.foreman.subordinates && this.foreman.subordinates.includes(this)) {
        this.foreman.subordinates.splice(this.foreman.subordinates.indexOf(this), 1)
      }
    }

    // проверяем покинувших подчинённых
    (this.subordinates || [])
      // подчиненный вышел
      .filter(eachSubordinate => !(actual.subordinates || []).includes(eachSubordinate.id))
      // удаляем себя из его старшин
      .forEach(eachLeft => eachLeft.foreman === this ? eachLeft.foreman = null : null);

    // проверяем отмененные заявки в старшины
    (this.foremanRequests || [])
      // подчиненный вышел
      .filter(eachForemanRequest => !(actual.foremanRequests || []).includes(eachForemanRequest.id))
      // удаляем себя из его старшин
      .forEach(eachLeft => eachLeft.foremanRequest === this ? eachLeft.foremanRequest = null : null);

    this.merge(actual)
    this.isLoaded = true

    return this;
  }

  /**
   * @param {Kopa} kopa
   */
  async inviteKopa(kopa) {
    const result = await this.constructor.api(`inviteKopa`, {
      method: 'POST',
      body: {
        subject: kopa.subject,
        participants: kopa.participants.map(eachParticipant => eachParticipant.id),
      }
    })

    return result
  }
}
