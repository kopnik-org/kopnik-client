import Vue from "vue"
import VueRouter from "vue-router";
import Profile from "../components/ProfileVue";
import Witness from "../components/WitnessVue";
import Map from "../components/MainVue";
import Thanks from "../components/ThanksVue";
import {container} from "./bottle";

Vue.use(VueRouter)

const routes = [
    // { path: '/', component: Map },
    {
        path: '/Profile',
        component: Profile,
        beforeEnter: async (to, from, next) => {
            if (container.application.user === undefined) {
                await container.application.authenticate()
            }
            if (container.application.user) {
                return next()
            } else {
                next({path: '/'})
            }
        }
    },
    {
        path: '/witness',
        component: Witness,
        beforeEnter: async (to, from, next) => {
            if (container.application.user === undefined) {
                await container.application.authenticate()
            }
            if (container.application.user) {
                return next()
            } else {
                next({path: '/'})
            }
        }
    },
    {
        path: '/thanks',
        component: Thanks,
        beforeEnter: async (to, from, next) => {
            if (container.application.user === undefined) {
                await container.application.authenticate()
            }
            if (container.application.user) {
                return next()
            } else {
                next({path: '/'})
            }
        }
    },
    {
        path: '/',
        component: Map,
    },
]

export default new VueRouter({
    mode: 'history',
    routes
})
