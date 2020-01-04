import Vue from "vue"

import VueRouter from "vue-router";
import Profile from "../components/ProfileVue";
import Witness from "../components/WitnessVue";
import Map from "../components/MainVue";
import Thanks from "../components/ThanksVue";
import {container} from "./bottle";
import {Kopnik} from '../models'
import Application from "../Application";
import flushPromises from "flush-promises";

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
                } else {
                    next({name: application.section})
                }
            })
        }
    },
    {
        path: '/' + Application.Section.Witness.toLowerCase(),
        name: Application.Section.Witness,
        beforeEnter: async (to, from, next) => {
            await application.lockSection(async () => {
                await application.setSection(Application.Section.Witness)
                if (application.section === Application.Section.Witness) {
                    next()
                } else {
                    next({name: application.section})
                }
            })
        }
    },
    {
        path: '/' + Application.Section.Thanks.toLowerCase(),
        name: Application.Section.Thanks,
        beforeEnter: async (to, from, next) => {
            await application.lockSection(async () => {
                await application.setSection(Application.Section.Thanks)
                if (application.section === Application.Section.Thanks) {
                    next()
                } else {
                    next({name: application.section})
                }
            })
        }
    },
    {
        path: '/',
        name: Application.Section.Main,
        beforeEnter: async (to, from, next) => {
            await application.lockSection(async () => {
                await application.setSection(Application.Section.Main)
                if (application.section === Application.Section.Main) {
                    next()
                } else {
                    next({name: application.section})
                }
            })
        }
    },
]
const router = new VueRouter({
    mode: 'history',
    routes
})
export default router
