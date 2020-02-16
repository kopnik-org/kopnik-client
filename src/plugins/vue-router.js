import Vue from "vue"

import VueRouter from "vue-router";
import {container} from "../bottle/bottle";
import Application from "../application/Application";

Vue.use(VueRouter)
const application = container.application

/**
 * Маршрут меняется только как реакция на изменение application.Section
 * next(false) срабатывает уже после цепочки, чтобы не было маргания роутов, и ни на что уже не влияет
 * setSection(newSection) -> watch(application.Section) -> next()
 *
 */
const routes = [
    {
        path: '/' + Application.Section.Profile.toLowerCase(),
        name: Application.Section.Profile,
        beforeEnter: async (to, from, next) => {
            await application.lockSection(async () => {
                    await application.setSection(Application.Section.Profile)
                    if (application.section === Application.Section.Profile) {
                        next()
                    } else if (application.section === from.name) {
                        next(false)
                    } else {
                        next({name: application.section})
                    }
                }
            )
        }
    },
    {
        path: '/' + Application.Section.Witness.toLowerCase(),
        name:
        Application.Section.Witness,
        beforeEnter:
            async (to, from, next) => {
                await application.lockSection(async () => {
                    await application.setSection(Application.Section.Witness)
                    if (application.section === Application.Section.Witness) {
                        next()
                    } else if (application.section === from.name) {
                        next(false)
                    } else {
                        next({name: application.section})
                    }
                })
            }
    },
    {
        path: '/' + Application.Section.Ten.toLowerCase(),
        name:Application.Section.Ten,
        beforeEnter:
            async (to, from, next) => {
                await application.lockSection(async () => {
                    await application.setSection(Application.Section.Ten)
                    if (application.section === Application.Section.Ten) {
                        next()
                    } else if (application.section === from.name) {
                        next(false)
                    } else {
                        next({name: application.section})
                    }
                })
            }
    },
    {
        path: '/' + Application.Section.Thanks.toLowerCase(),
        name:
        Application.Section.Thanks,
        beforeEnter:
            async (to, from, next) => {
                await application.lockSection(async () => {
                    await application.setSection(Application.Section.Thanks)
                    if (application.section === Application.Section.Thanks) {
                        next()
                    } else if (application.section === from.name) {
                        next(false)
                    } else {
                        next({name: application.section})
                    }
                })
            }
    }
    ,
    {
        path: '/',
        name:
        Application.Section.Main,
        beforeEnter:
            async (to, from, next) => {
                await application.lockSection(async () => {
                    await application.setSection(Application.Section.Main)
                    if (application.section === Application.Section.Main) {
                        next()
                    } else if (application.section === from.name) {
                        next(false)
                    } else {
                        next({name: application.section})
                    }
                })
            }
    }
    ,
]

/**
 * Фабрика для тестов важна,
 * чтобы в каждом тесте был свой чистый роутер,
 * не зависящий от предедущих тестов
 *
 * @returns {VueRouter}
 */
function routerFactory() {
    return new VueRouter({
        mode: 'history',
        routes
    })
}

export default routerFactory
