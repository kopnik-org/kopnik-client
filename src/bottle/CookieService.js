/**
 * Предоставляет куки
 * По умолчанию куки из конфига config.di.coockie
 * Умеет пуш-попить куки, отходя от конфига при этом, полезно во время сквозных тестов
 * @example coockieService.push(1)
 * @example coockieService.pop()
 */
export default class CookieService {
    constructor(config) {
        this.stack=[null]
    }
    push(){
        return this.stack.push(this.cookie)
    }
    pop(){
        return this.stack.pop()
    }
    get cookie (){
        if (this.stack.length) {
            return this.stack[this.stack.length - 1]
        }
        else{
            return null
        }
    }
    set cookie (value){
        this.stack[this.stack.length-1]=value
    }
}
