import {AbstractSync, Kopnik} from "./models";

export default class Application {
    static getInstance() {
        if (!this.instance) {
            this.instance = new this()
        }
        return this.instance
    }

    user = null

    constructor() {
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

        this.user = undefined

        this.initUser()
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
    async initUser() {
        let vkUser = localStorage.getItem("vkUser")
        if (vkUser) {
            vkUser = JSON.parse(vkUser)
            let user //= await Kopnik.getVkUserStatus(vkUser.uid)
            if (vkUserStatus) {
                this.user= Kopnik.merge(vkUserStatus.user)
            } else {
                this.setVkUser(vkUser)
                this.SECTION="Profile"
            }
        }
    }

    /**
     * Учстанавливает пользователем объект из VK.init::success()
     * @param vkUser
     * @returns
     */
    setVkUser(vkUser){
        this.user= new Kopnik
        this.user.merge({
            hash: vkUser.hash,
            uid: vkUser.uid,
            firstname: vkUser.first_name,
            surname: vkUser.last_name,
            photo: vkUser.photo,
            smallPhoto: vkUser.photo_rec,
        })
        localStorage.setItem("vkUser", JSON.stringify(vkUser))
    }
}
