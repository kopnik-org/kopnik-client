class KopnikError extends Error {
    constructor(message, code) {
        super(message)
        this.code = code
    }
}
class KopnikApiError extends KopnikError {
    constructor(message, code, url) {
        super(message, code)
        this.url = url
    }
}



export {KopnikError, KopnikApiError}
