import {container} from "../plugins/bottle";
import {KopnikApiError} from "../KopnikError";

export default async function api(url, options={}) {
    let response
    let fullUrl= container.config.api.path +'/'+ url
    try {
        response= await fetch(fullUrl, Object.assign({api: true}, options))
        return response.data.response
        // Пропал 4G
    } catch (err) {
        if (err instanceof KopnikApiError){
            throw err
        }
        else if (err.name=='AbortError'){
            throw err
        }
        else{
            throw new KopnikApiError(err.message, err.code, fullUrl)
        }
    }
    // Не найдена страница или синтаксическая ошибка в веб-сервисе
    if (!response.ok) {
        throw new KopnikApiError(response.statusText, response.status, fullUrl)
    }
}
