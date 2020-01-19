const KopnikError = require("../src/KopnikError").KopnikError;


module.exports = {
    test(received) {
        return received instanceof KopnikError
    },
    print(received) {
        const data = {
            message: received.message,
            code: received.code,
            base: received.base,
        }
        if (received.url) {
            data.url = received.url
        }
        let result = JSON.stringify(data)
        result = `{ error: ${result} }`
        return result
    }
}
