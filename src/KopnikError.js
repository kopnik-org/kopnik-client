class KopnikError extends Error {
    constructor(message, code, base) {
        super(message)
        this.code = code
        this.base= base
    }
}
class KopnikApiError extends KopnikError {
    constructor(message, code, url, base) {
        super(message, code, base)
        this.url = url
    }
}

export {KopnikError, KopnikApiError}
