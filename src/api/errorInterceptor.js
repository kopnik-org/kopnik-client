import {KopnikApiError} from "../KopnikError";
import {container} from "../plugins/bottle";

export default {
    request: function (url, options) {
        return [url, options]
    },
    requestError: function (error) {
        return Promise.reject(error);
    },
    response: async function (response) {
        if (!response.url.includes(container.config.api.path)) {
            return response
        }
        if (!response.ok){
            throw new Error(response.statusText, response.status, null)
        }
        if (response.data.error) {
            throw new KopnikApiError(response.data.error.error_msg, response.data.error.error_code, response.url)
        }
        return response
    },

    responseError: function (error) {
        return Promise.reject(error);
    }
}
