import once from './once'
import config from "../../config";
import * as models from "../models";

export function sync(constructor) {
    // throw new Error("deprecated")
    constructor.prototype.get = once(async function () {
        let result = {
            // id: Math.ceil(Math.random()*100),
            name: "A".repeat(Math.ceil(Math.random() * 10))
        }
        return result
    })

    constructor.prototype.reload = once(async function () {
        let result = await this.get()
        for (let eachPropName of Object.keys(result)) {
            this[eachPropName] = result[eachPropName]
        }

        this.isLoaded = true
    })

    constructor.prototype.loaded = once(async function () {
        if (!this.isLoaded) {
            await this.reload()
        }
        return this
    })

    let result= function (...args) {
        let instance = new constructor(...args)
        instance.isLoaded = false
        return instance
    }
    result.scalars= constructor.scalars

    return result
}

export function scalar(target, name, descriptor) {
    //положить все скалярные поля в статический массив
    target.constructor.scalars= target.constructor.scalars || []
    target.constructor.scalars.push(name)

    //обозначить скарярность в дескрипторе свойства -  не работает
    // descriptor.scalar= true
}

export function object(target, name, descriptor) {
    //положить все скалярные поля в статический массив
    target.constructor.objects= target.constructor.objects || []
    target.constructor.objects.push(name)

    let capitalizedName = name[0].toUpperCase() + name.slice(1)
    Object.defineProperty(
        target,
        "get" + capitalizedName,
        {
            value: once(async function (...args) {
                if (this[name+'_id']===undefined){
                    throw new Error("model is not loaded")
                }
                else if (this[name+'_id']===null){
                    return null
                }
                else {
                    return await models['Kopnik'].get(this[name + '_id'])
                }
            })
        }
    )

    Object.defineProperty(
        target,
        "reload" + capitalizedName,
        {
            configurable: true,
            value: once(async function (...args) {
                this[name] = this["get" + capitalizedName](...args)
                return this[name]
            })
        }
    )

    Object.defineProperty(
        target,
        "loaded" + capitalizedName,
        {
            configurable: true,
            get: once(async function (...args) {
                if (this[name] == undefined) {
                    this[name] = await this["reload" + capitalizedName](...args)
                }
                return this[name]
            })
        }
    )
}

export function collection(target, name, descriptor) {
    target.constructor.collections= target.constructor.collections || []
    target.constructor.collections.push(name)

    let capitalizedName = name[0].toUpperCase() + name.slice(1)
    Object.defineProperty(
        target,
        "get" + capitalizedName,
        {
            value: once(async function (...args) {
                let result = []
                for (let x = 0; x < Math.ceil(Math.random() * 10); x++) {
                    result.push({id: Math.ceil(Math.random() * 100)})
                }
                return result
            })
        }
    )

    Object.defineProperty(
        target,
        "_reload" + capitalizedName,
        {
            configurable: true,
            value: once(async function (...args) {
                this[name] = this["get" + capitalizedName](...args)
                return this[name]
            })
        }
    )

    Object.defineProperty(
        target,
        "loaded" + capitalizedName,
        {
            configurable: true,
            get: once(async function (...args) {
                if (this[name] == undefined) {
                    this[name] = await this["reload" + capitalizedName](...args)
                }
                return this[name]
            })
        }
    )
}
