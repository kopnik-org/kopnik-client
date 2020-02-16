import {KopnikApiError} from "../KopnikError";
import {container} from "../bottle/bottle";

export default {
    request: function (url, options) {
        return [url, options]
    },
    requestError: function (error) {
        return Promise.reject(error)
    },
    response: async function (response) {
        return response
    },

    responseError: function (error) {
        if (error instanceof KopnikApiError && error.message.match(/auth/)){
            container.application.user= null
        }
        return Promise.reject(error)
    }
}
