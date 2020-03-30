import get from "keypather/get"
import has from "keypather/has"

import AsyncLock from 'async-lock'
import {AbstractSync, Kopnik, Kopa} from "../models";
import {KopnikApiError, KopnikError} from "../KopnikError";
import once from "../decorators/once";
import SquadAnalyzer from "../SquadAnalyzer";
import fetchIntercept from 'fetch-intercept'
import {container} from "../bottle/bottle";
import {LatLng, LatLngBounds} from 'leaflet'
import Main from "./Main";
import messages from "../locales";

export default class Application {
    constructor(logger) {
        this.logger = logger.getLogger('Application')
        /**
         * Кэш моделей
         * @type {Array}
         */
        // пока не понятно зачем приложению кэш.
        // он вероятно будет сильно торможить приложение из-за реактивности App.$data в которой он находится
        // хотя он же не в App.$data а в App.$options !!
        // уже в дата потому тчо в options не реактивен
        //this.models = AbstractSync.cache

        /**
         * Идентификатор раздела
         * Равен названиею соответствующего компонента
         *
         * @type {string} Map | Profile | Thanks
         */
        this.section = Application.Section.Main
        this.sectionLocker = new AsyncLock

        /**
         * 0 потому что на undefined не срабатывает watcher,
         * а null занят под "пользователь не аутентифицирован"
         * @type {Kopnik}
         */
        this.user = undefined

        /**
         * Сообщения пользователю
         * @type {String[]}
         */
        this.infos = []
        /**
         * Обишки приложения
         * @type {Error[]}
         */
        this.errors = []
        this.sections = {
            main: new Main(this)
        }
    }

    async onerror(err) {
        if (err.code === 401) {
            await container.application.lockSection(async () => {
                await application.setSection(Application.Section.Main)
            })
            this.user= null
            console.info('prevent 401 error', err)
        } else {
            this.logger.error(err)
            if (err instanceof KopnikApiError){
                this.logger.info(err.url)
            }
            this.errors.push(err)
            // throw err
        }
    }

    getMessage(message) {
        for(const eachLocaleName of [container.localeManager.currentLocale.name, 'ru']) {
            if (has(container.messages[eachLocaleName], message)) {
                const result = get(container.messages[eachLocaleName], message)
                return result
            }
        }
        throw new KopnikError('No message provided: ' + message, 2)
    }

    /**
     * Эксклюзивный доступ к section
     * @param {function} callback
     * @returns {Promise<any>}
     */
    lockSection(callback) {
        return this.sectionLocker.acquire('section', callback)
    }

    /**
     * Устанавливить секцию
     * Если секция не может быть установлена, возвращает иную
     *
     * @param {String} section
     * @returns {Promise<string>} Установленная секция
     */
    async setSection(section) {
        let result
        if (this.section === section) {
            return section
        }
        switch (section) {
            case Application.Section.Profile:
            case Application.Section.Witness:
            case Application.Section.Ten:
                if (await this.resolveUser()) {
                    if (section === Application.Section.Profile || this.user.status === Kopnik.Status.CONFIRMED) {
                        result = section
                    } else {
                        result = await this.setSection(Application.Section.Main)
                    }
                } else {
                    result = await this.setSection(Application.Section.Main)
                }
                break
            case Application.Section.Main:
            case Application.Section.Thanks:
                result = section
                break
            default:
                throw new KopnikError('Wrong route', 666)
        }
        // this.logger.info('move', this.section, '->', section)
        return this.section = result
    }


    getSharedState() {
        return {
            SECTION: this.section
        }
    }

    setState(state) {
        if (state.section) {
            this.section = state.section
        }
    }

    /**
     * Определиться с пользователем. Или он некий копник, или он null, то есть незарегистрирован на сервере
     * @returns {Promise<Kopnik>}
     */
    async resolveUser() {
        if (this.user === undefined) {
            await this.authenticate()
        }
        return this.user
    }

    /**
     * Инициализирует ползователя при запуске приложения
     *
     * @returns {Promise<void>}
     */
    @once
    async authenticate() {
        try {
            let userAsPlain = (await Kopnik.api('get?ids='))[0]
            this.user = await Kopnik.get(userAsPlain.id)
            container.localeManager.currentLocale= this.user.locale
            this.logger.info('user authenticated', this.user)
        } catch (err) {
            if ((err instanceof KopnikApiError) && err.message.match(/no.+aut/i)) {
                 this.user = null
                this.logger.info('user not authenticated')
            } else {
                throw err
            }
        }
    }

    /**
     * Инициализирует ползователя при запуске приложения
     *
     * @returns {Promise<void>}
     */
    @once
    async logout() {
        await this.lockSection(() => {
            this.setSection(Application.Section.Main)
        })
        this.sections.main.selected= null
        await container.api('logout')
        this.user = null
    }
}

/**
 * @enum {string}
 */
Application.Section = {
    Main: 'Main',
    Profile: 'Profile',
    Witness: 'Witness',
    Thanks: 'Thanks',
    Ten: 'Ten',
    Help: 'Help',
}
