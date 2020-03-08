import Vue from 'vue'
import {container} from "./bottle/bottle";

global.addEventListener("error", function (event) {
    container.application.onerror(event.error)
})
global.addEventListener("unhandledrejection", function (event) {
    container.application.onerror(event.reason)
})
Vue.config.errorHandler = (err, vm, info) => {
    err.vm= vm
    err.info= info
    container.application.onerror(err)
}

