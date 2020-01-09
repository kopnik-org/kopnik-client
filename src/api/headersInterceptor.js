import {container} from "../plugins/bottle";
import _ from "lodash";

export default {
    request: function (url, options) {
        if (!url.startsWith(container.config.api.path)) {
            return [url, options]
        }

        options.method = (options.method || 'GET').toUpperCase()
        options = _.merge({
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': options.method === 'GET' ? 'text/plain' : 'application/x-www-form-urlencoded;charset=UTF-8',
                }
            },
            options)
        return [url, options]
    },
    requestError: function (error) {
        return Promise.reject(error);
    },
    response: function (response) {
        return response;
    },

    responseError: function (error) {
        return Promise.reject(error);
    }
}
