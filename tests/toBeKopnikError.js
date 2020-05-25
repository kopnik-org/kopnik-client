
import {KopnikError} from "../src/KopnikError";

export default function toBeKopnikError(error, match) {
    const {code, message}= (typeof match === 'number')?{code:match}:(typeof match === 'string')?{message: match}:match
    const pass = (error instanceof KopnikError) && (!code || code===error.code) && (!message || error.message.match(message))
    if (pass) {
        return {
            message: () => `expected KopnikError code ${match}, got ${error.constructor.name} code ${error.code} ${error.stack}`,
            pass: true
        };
    }
    return {
        message: () => `expected KopnikError code ${match}, got ${error.constructor.name} code ${error.code} ${error.stack}`,
        pass: false
    }
}

