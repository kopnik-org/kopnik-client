import {container} from "../bottle/bottle";

export default {
    request: function (url, options) {
        if (!url.includes(container.config.api.path)) {
            return [url, options]
        }
        if (options.method !== 'GET' && options.body) {
            options.body = JSON.stringify(options.body)
        }
        return [url, options]
    },
    requestError: function (error) {
        return Promise.reject(error)
    },
    response: async function (response) {
        if (!response.url.includes(container.config.api.path)) {
            return response
        }
        switch (response.headers.get('Content-Type')) {
            case 'application/json':
                // result = await response.text()
                response.data = await response.json()
                break
            default:
                response.data = await response.text()
        }
        return response
    },

    responseError: function (error) {
        return Promise.reject(error);
    }
}
