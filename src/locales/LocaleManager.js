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

        this.currentLocale = this.locales[0]
    }

    get currentLocale(){
        return this._currentLocale
    }

    /**
     *
     * @param {Locale} value
     */
    set currentLocale(value) {
        const name= (typeof value === 'object')?value.name:value
        this._currentLocale= this.getLocaleByShortName(name)
    }

    getLocaleByShortName(name){
        const result= this.locales.find(eachLocale=>eachLocale.name===name)
        if (!result){
            throw new Error('Wrong locale '+name)
        }
        return result
    }
}
