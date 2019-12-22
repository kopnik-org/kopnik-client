/**
 * Предоставляет куки
 * По умолчанию куки из конфига config.di.coockie
 * Умеет пуш-попить куки, отходя от конфига при этом, полезно во время сквозных тестов
 * @example coockieService.push(1)
 * @example coockieService.pop()
 */
export default class CookieService {
    constructor(config) {
        this.cookies = {
            1: 'PHPSESSID=user-1',
            2: 'PHPSESSID=54ej6frjd1d7b1kgclk4h5ooqd',
            3: 'PHPSESSID=user-3',
            4: 'PHPSESSID=user-4',
            5: 'PHPSESSID=user-5',
            6: 'PHPSESSID=user-6',
            7: 'PHPSESSID=user-7',
            8: 'PHPSESSID=user-8',
            9: 'PHPSESSID=user-9',
            10: 'PHPSESSID=user-10',
        }
        this.stack=[config.di.cookie]
    }
    push(id=undefined){
        return this.stack.push(id)
    }
    pop(){
        return this.stack.pop()
    }
    get cookie (){
        return this.cookies[this.stack[this.stack.length-1]]
    }
}
