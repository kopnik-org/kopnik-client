import {container} from './index'
import _ from 'lodash'
import jsonToFormData from 'json-form-data'
import {KopnikApiError} from "../KopnikError";


export default async function fetchApi(url, options = {}) {
    const defaultOptions = {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'text/plain',
            }
        },
        cookieOptions = (container.constants.di.cookie && container.cookieService.cookie) ? {headers: {Cookie: container.cookieService.cookie}} : null

    options = _.merge({}, defaultOptions, cookieOptions, options)
    if (options.body) {
        options.body = JSON.stringify(options.body)
    }
    // container.logger.warn(options)
    // console.log(container.constants.api.path)
    let fullUrl = `${container.constants.api.path}/${url}`.replace(/\w+\/\.\.\//, '')

    try {
        // console.log(url, options)
        var response = await fetch(fullUrl, options)
        // Пропал 4G
    } catch (err) {
        throw new KopnikApiError(err.message, null, fullUrl)
    }
    // Не найдена страница или синтаксическая ошибка в веб-сервисе
    if (!response.ok) {
        throw new KopnikApiError(response.statusText, response.status, fullUrl)
    }

    let cookie = response.headers.get('set-cookie')
    if (container.constants.di.cookie && cookie) {
        cookie = cookie.match(/(\w+=(\w|\d)+)/)[0]
        container.cookieService.cookie = cookie
    }
    // container.logger.warn(cookie, response.headers)
    let result
    switch (response.headers.get('Content-Type')) {
        case 'application/json':
            // result = await response.text()
            result = await response.json()
            // Не авторизован/Нет такого пользователя
            if (result.error) {
                console.log(result.error)
                throw new KopnikApiError(result.error.error_msg, result.error.error_code, fullUrl)
            }
            break
        default:
            result = await response.text()
    }

    return result.response
}
