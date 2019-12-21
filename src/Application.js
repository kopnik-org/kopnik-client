import {AbstractSync, Kopnik} from "./models";
import {KopnikApiError} from "./KopnikError";
import once from "./decorators/once";


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

        this.authenticate()
            .then(() => {
                if (!this.user) {
                    this.SECTION = 'Map'
                } else if (this.user.status == Kopnik.Status.NEW || this.user.status == Kopnik.Status.DECLINED) {
                    this.SECTION = 'Profile'
                } else {
                    this.SECTION = 'Map'
                }
            })
    }


    async loadTop20() {
        this.top20 = await Promise.all([1, 2, 3, 4].map(each => Kopnik.get(each)))
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
            this.user = Kopnik.merge(userAsPlain)
            this.user.isLoaded = true
            this.user.photo = 'avatar.png'
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
