import get from "keypather/get"
import has from "keypather/has"

import AsyncLock from 'async-lock'
import {AbstractSync, Kopnik, Kopa} from "../models";
import {KopnikApiError, KopnikError} from "../KopnikError";
import once from "../decorators/once";
import {container} from "../bottle/bottle";
import Main from "./Main";

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

    /**
     * Перенаправляет пользователя на страницу регистрации и просит зарегисться
     * @returns {Promise<void>}
     */
    async forwardUserToRegister() {
        await this.lockSection(async () => {
            this.setSection(Application.Section.Profile)
            this.infos.push(this.getMessage('application.youHaveToRegister'))
        })
    }

    /**
     * Сообщает пользователю что он должен подтвердить данные
     * @returns {Promise<void>}
     */
    forwardUserToWitnessHisData() {
        this.infos.push(this.getMessage('application.youHaveToWitnessYourData'))
    }

    /**
     * Направляет пользователя
     * @returns {Promise<boolean>}
     */
    async forwardUserToBeConfirmed() {
        if (!this.user) {
            return true
        } else {
            switch (this.user.status) {
                case Kopnik.Status.NEW:
                    await this.forwardUserToRegister()
                    return true
                case Kopnik.Status.PENDING:
                    await this.forwardUserToWitnessHisData()
                    return true
                case Kopnik.Status.DECLINED:
                    await this.forwardUserToRegister()
                    return true
                case Kopnik.Status.CONFIRMED:
                    return false
            }
        }
    }

    async onerror(err) {
        var classifyRE = /(?:^|[-_])(\w)/g;
        var classify = function (str) {
            return str
                .replace(classifyRE, function (c) {
                    return c.toUpperCase();
                })
                .replace(/[-_]/g, '');
        };

        const formatComponentName = function (vm, includeFile) {
            if (vm.$root === vm) {
                return '<Root>'
            }
            var options = typeof vm === 'function' && vm.cid != null
                ? vm.options
                : vm._isVue
                    ? vm.$options || vm.constructor.options
                    : vm;
            var name = options.name || options._componentTag;
            var file = options.__file;
            if (!name && file) {
                var match = file.match(/([^/\\]+)\.vue$/);
                name = match && match[1];
            }

            return (
                (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
                (file && includeFile !== false ? (" at " + file) : '')
            )
        };

        var repeat = function (str, n) {
            var res = '';
            while (n) {
                if (n % 2 === 1) {
                    res += str;
                }
                if (n > 1) {
                    str += str;
                }
                n >>= 1;
            }
            return res
        };

        const generateComponentTrace = function (vm) {
            if (vm._isVue && vm.$parent) {
                var tree = [];
                var currentRecursiveSequence = 0;
                while (vm) {
                    if (tree.length > 0) {
                        var last = tree[tree.length - 1];
                        if (last.constructor === vm.constructor) {
                            currentRecursiveSequence++;
                            vm = vm.$parent;
                            continue
                        } else if (currentRecursiveSequence > 0) {
                            tree[tree.lengthyouHaveToRegister - 1] = [last, currentRecursiveSequence];
                            currentRecursiveSequence = 0;
                        }
                    }
                    tree.push(vm);
                    vm = vm.$parent;
                }
                return '\n\nfound in\n\n' + tree
                    .map(function (vm, i) {
                        return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
                            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
                            : formatComponentName(vm)));
                    })
                    .join('\n')
            } else {
                return ("\n\n(found in " + (formatComponentName(vm)) + ")")
            }
        };

        if (err.code === 401) {
            await container.application.lockSection(async () => {
                await application.setSection(Application.Section.Main)
            })
            this.user = null
            console.info('prevent 401 error', err)
        } else {
            this.logger.error(...[err, err.info, err.vm ? generateComponentTrace(err.vm) : null, err.url].filter(item => item))
            this.errors.push(err)
            // throw err
        }
    }

    getMessage(message) {
        for (const eachLocaleName of [container.localeManager.currentLocale.name, 'ru']) {
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
                if (await this.resolveUser() && (this.user.status === Kopnik.Status.CONFIRMED || section === Application.Section.Profile)) {
                    result = section
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
            const user = new Kopnik()
            await user.reload()
            this.user = Kopnik.merge(user.plain, true)
            container.localeManager.currentLocale = user.locale
            this.logger.info('user authenticated', this.user.plain)
        } catch (err) {
            if ((err instanceof KopnikApiError) && err.message.match(/no.+aut/i)) {
                // назначаем null вместо текущего undefined
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
        this.sections.main.selected = null
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
