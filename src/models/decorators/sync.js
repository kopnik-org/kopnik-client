import once from './once'
import config from "../../../config";

export function sync(constructor) {
    constructor.prototype.get = once(async function () {
        console.log(`fetch path/to/api/${constructor.name}/id=`, this.id)
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

    return function (...args) {
        let instance = new constructor(...args)
        instance.isLoaded = false
        return instance
    }


    return result
}

export function collection(target, name, descriptor) {
    let capitalizedName = name[0].toUpperCase() + name.slice(1)
    Object.defineProperty(
        target,
        "get" + capitalizedName,
        {
            value: once(async function (...args) {
                // console.log(`fetch path/to/api/${this.constructor.name}/get${capitalizedName}?id=`, this.id)
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
        "reload" + capitalizedName,
        {
            configurable: true,
            value: once(async function (...args) {
                this[name] = this["get" + capitalizedName]()
                return this[name]
            })
        }
    )

    Object.defineProperty(
        target,
        "loaded" + capitalizedName,
        {
            configurable: true,
            get: once(async function () {
                if (this[name] == undefined) {
                    this[name] = await this["reload" + capitalizedName]()
                }
                return this[name]
            })
        }
    )
}
