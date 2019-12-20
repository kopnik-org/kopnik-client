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
    toString(){
        return `${this.message} (${this.code}) ${this.url}`
    }
}

export {KopnikError, KopnikApiError}
