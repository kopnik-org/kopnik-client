import {AbstractSync, Kopnik, Kopa} from "./models";
import {KopnikApiError} from "./KopnikError";
import once from "./decorators/once";
import SquadAnalyzer from "./SquadAnalyzer";


export default class Application {
    constructor(logger) {
        this.logger = logger.getLogger('application')
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
        this.SECTION = "Map"

        /**
         * 0 потому что на undefined не срабатывает watcher,
         * а null занят под "пользователь не аутентифицирован"
         */
        this.user = undefined

        this.top20 = []
        this.squadAnalyzer = new SquadAnalyzer()
        this.kopa= new Kopa
        /**
         *
         * @type {Kopnik}
         */
        this.selected= null
   }

    /**
     * Исследует дружину
     * @param {Kopnik} kopnik
     * @returns {Promise<void>}
     */
    async analyzeSquad(kopnik) {
        await this.squadAnalyzer.analyze(kopnik)
    }

    async loadTop20() {
        this.top20 = await Promise.all([1, 2, 3, 4].map(each => Kopnik.get(each)))
        this.logger.warn('manual set foremans')
        Kopnik.getReference(1).rank = 4
        Kopnik.getReference(2).foreman = Kopnik.getReference(3)
        Kopnik.getReference(2).rank = 1
        Kopnik.getReference(3).foreman = Kopnik.getReference(1)
        Kopnik.getReference(3).rank = 3
        Kopnik.getReference(4).foreman = Kopnik.getReference(3)
        Kopnik.getReference(4).rank = 1

        Kopnik.getReference(1).ten = [Kopnik.getReference(3)]
        Kopnik.getReference(2).ten = []
        Kopnik.getReference(3).ten = [Kopnik.getReference(2), Kopnik.getReference(4)]
        Kopnik.getReference(4).ten = []
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

    getSharedState() {
        return {
            SECTION: this.SECTION
        }
    }

    setState(state) {
        if (state.SECTION) {
            this.SECTION = state.SECTION
        }
    }

    /**
     * Инициализирует ползователя при запуске приложения
     *
     * @returns {Promise<void>}
     */
    @once
    async authenticate() {
        try {
            let userAsPlain = (await Kopnik.fetchApi('get?ids='))[0]
            this.user = await Kopnik.get(userAsPlain.id)
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
     * Учстанавливает пользователем объект из VK.Auth callback
     *
     * @param vkUser
     * @returns
     */
    /*    async setVkUser(vkUser) {
            global.credentials = {
                uid: vkUser.uid,
                hash: vkUser.hash
            }
            this.user = await Kopnik.getByUid(vkUser.uid)
            if (!this.user) {
                this.user = new Kopnik
                this.user.merge({
                    firstName: vkUser.first_name,
                    lastName: vkUser.last_name,
                    photo: vkUser.photo,
                    smallPhoto: vkUser.photo_rec,
                })

                this.SECTION = "Profile"
            }
            // this.user.uid= vkUser.uid
            // this.user.hash= vkUser.hash

            // localStorage.setItem("vkUser", JSON.stringify(vkUser))
        }
        */
}
