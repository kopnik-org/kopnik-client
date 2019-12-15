export default function once(target, name, descriptor) {
    const original = descriptor ? descriptor.value : target
    const result = function (...args) {
        if (!original.promise) {
            let promise = original.apply(this, args)

            if (!(promise instanceof Promise)) {
                return promise
            }

            original.promise = promise

            original.promise
                .then(() => {
                    original.promise = undefined
                })
                .catch(() => {
                    original.promise = undefined
                })
        }
        return original.promise
    }
    if (descriptor){
        descriptor.value=result
    }
    else{
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
