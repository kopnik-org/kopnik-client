import Locale from './Locale'
import {container} from "../bottle/bottle";

export default class LocaleManger {
  constructor() {
    this.locales = []

    Object.keys(container.messages).forEach(eachLocaleName => {
      const eachLocale = new Locale()
      eachLocale.name = eachLocaleName
      eachLocale.languageName = container.messages[eachLocaleName].languageName
      this.locales.push(eachLocale)
    })

    // определяю последнюю сохраненную локаль, как бы восстанавливая сессию
    this.detectLocale()

    // если никакой локали нет, то устанавливаю русскую
    if (!this._currentLocale) {
      this._currentLocale = this.locales[0]
    }
  }

  get currentLocale() {
    return this._currentLocale
  }

  /**
   *
   * @param {Locale} value
   */
  set currentLocale(value) {
    const name = (typeof value === 'object') ? value.name : value
    this._currentLocale = this.getLocaleByShortName(name)
    localStorage.setItem('locale', this._currentLocale.name)
  }

  getLocaleByShortName(name) {
    const result = this.locales.find(eachLocale => eachLocale.name === name)
    if (!result) {
      throw new Error('Wrong locale ' + name)
    }
    return result
  }

  detectLocale() {
    const localStorageLocale = localStorage.getItem('locale')
    if (localStorageLocale) {
      this.currentLocale = localStorageLocale
      return
    }

    const browserLocale = (navigator.language || navigator.userLanguage || 'ru-RU').split('-')[0]
    if (container.env==='test'){
      this.currentLocale= 'ru'
    }
    else if(container.messages[browserLocale]) {
      this.currentLocale = browserLocale
    }
  }
}
