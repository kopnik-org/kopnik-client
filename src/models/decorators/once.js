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