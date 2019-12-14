class KopnikError extends Error {
    constructor(message, code) {
        super(message)
        this.code = code
    }
}
class KopnikApiError extends KopnikError {
    constructor(message, code, url, status) {
        super(message, code)
        this.url = url
        this.status = status
    }
}



export {KopnikError, KopnikApiError}
