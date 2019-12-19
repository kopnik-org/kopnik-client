import Vue from "vue"
import VueRouter from "vue-router";
import Profile from "../components/ProfileVue";
import Witness from "../components/WitnessVue";
import Map from "../components/MainVue";
import Thanks from "../components/ThanksVue";

Vue.use(VueRouter)

let application = global.application

const routes = [
    // { path: '/', component: Map },
    {
        path: '/Profile',
        component: Profile,
        beforeEnter: async (to, from, next) => {
            if (global.app.user === undefined) {
                await app.authenticate()
            }
            if (global.app.user) {
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
            if (global.app.user === undefined) {
                await app.authenticate()
            }
            if (global.app.user) {
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
            if (global.app.user === undefined) {
                await app.authenticate()
            }
            if (global.app.user) {
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
