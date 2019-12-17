export default function once(target, name, descriptor) {
    const original = descriptor ? descriptor.value : target
    const result = function (...args) {
        let promises= original.__promises= original.__promises||new Map
        if (!promises.get(this)) {
/*            if (this.constructor.name=='Kopnik') {
                console.log('once', this.id, this.name)
                console.time(this.id || this.name)
            }*/
            let promise = original.apply(this, args)

            if (!(promise instanceof Promise)) {
                return promise
            }

            promises.set(this, promise)

            promises.get(this)
                .then(() => {
/*                    if (this.constructor.name=='Kopnik') {
                        console.log('clear', this.id, this.name)
                        console.timeEnd(this.id || this.name)
                    }*/
                    promises.set(this, undefined)
                })
                .catch(() => {
                    promises.set(this, undefined)
                })
        } else {
/*            if (this.constructor.name=='Kopnik') {
                console.log('twice', this.id, this.name)
            }*/
        }
        return promises.get(this)
    }
    if (descriptor) {
        descriptor.value = result
    } else {
        return result
    }
}
/*
export default function once(target) {
    return function (...args) {
        if (!target.promise) {
            let promise = target.apply(this, args)

            if (!(promise instanceof Promise)) {
                return
            }

            target.promise = promise

            target.promise
                .then(() => {
                    target.promise = undefined
                })
                .catch(() => {
                    target.promise = undefined
                })
        }

        return target.promise
    }
}
*/
