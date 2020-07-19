import Bottle from "bottlejs";

class $Main {
    constructor(small) {
        // console.log("constructor Main", small)
        this.a = "aaaa"
        this.small = small
    }
}

class $Small {
    constructor() {
        // console.log("constructor Small")
        this.b = "bbb"
    }
}

let $function = function () {
    // console.log("function")
    return {a: 1, b: 2}
}

describe('DI', () => {
    let bottle
    beforeAll(() => {
        Bottle.clear()
        Bottle.config.strict= true
        bottle = new Bottle()
        bottle.constant('value', {value: 'value'})
        bottle.service($function.name, $function)

        bottle.service($Main.name, $Main, $Small.name)
        // bottle.service($Main.name + `.Nest`, {})
        bottle.factory($Small.name, function (container) {
            return new $Small()
        })
    })
    it('value', async () => {
        let a = bottle.container.value
        let b = bottle.container.value
        expect(a).toBe(b)
    })
    it('function', async () => {
        let a = bottle.container[$function.name]
        let b = bottle.container[$function.name]
        expect(a).toBe(b)
    })
    it('Small', async () => {
        let a = bottle.container[$Small.name]
        let b = bottle.container[$Small.name]
        expect(a).toBe(b)
    })
    it('$Main', async () => {
        let a = bottle.container[$Main.name]
        let b = bottle.container[$Main.name]
        expect(a).toBe(b)
    })
})
